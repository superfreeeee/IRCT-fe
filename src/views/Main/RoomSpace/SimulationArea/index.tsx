import React, {
  FC,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { AppState } from '@store/reducers';
import {
  AreaOffset,
  joinRoomSpaceAction,
  leaveRoomSpaceAction,
  SimulationSpace,
  updateAreaOffsetAction,
  updateNearbyFiguresAction,
} from '@store/reducers/space';
import useDragPosition, { DragEventType } from '@hooks/useDragPosition';
import useClosestRef from '@hooks/useClosestRef';
import { roundBy } from '@utils';
import Figure from './Figure';
import { SimulationBoard } from './styles';
import { calcNearbyFigures, calcInitPosition } from './utils';
import { SIMULATION_AREA_SHRINK } from './config';
import { selectedRoomInfoState } from '@views/Main/state/im';
import { useRecoilValue } from 'recoil';
import {
  currentUserTeamDataState,
  userVideoVoiceSwitchFamily,
} from '@views/Main/state/user';

interface UseBoardDraggerOptions {
  roomId: string;
  adaptSize: boolean;
  areaWrapperRef: RefObject<HTMLDivElement>;
  boardRef: RefObject<HTMLDivElement>;
}

/**
 * 支持仿真空间拖拽
 * @param initOffset
 * @param param1
 * @returns
 */
const useBoardDragger = (
  initOffset: AreaOffset,
  { roomId, adaptSize, areaWrapperRef, boardRef }: UseBoardDraggerOptions,
) => {
  const [areaOffset, setAreaOffset] = useState<AreaOffset>(initOffset);
  const areaOffsetRef = useClosestRef(areaOffset);

  const boardRectRef = useRef<DOMRect>(null); // 记忆背景板 DOMRect 对象
  const prevOffsetRef = useRef<AreaOffset>(null); // 记忆拖拽起始位置
  const dispatch = useDispatch();
  let { onMouseDown: onBoardMouseDown } = useDragPosition(
    (_, { type, dx, dy }) => {
      if (type === DragEventType.Down) {
        // 1. Down
        prevOffsetRef.current = areaOffsetRef.current;
      } else {
        // 2. Move | Up
        if (!boardRectRef.current) {
          boardRectRef.current = boardRef.current.getBoundingClientRect();
        }
        const boardRect = boardRectRef.current;
        const wrapperRect = areaWrapperRef.current.getBoundingClientRect();

        // TODO clear console
        // console.log(
        //   `[SimulationArea.useBoardDragger] ${type}(dx, dy) = (${dx},${dy})`
        // );
        const [x, y] = prevOffsetRef.current;

        const left = roundBy(x + dx, wrapperRect.width - boardRect.width, 0);
        const top = roundBy(y + dy, wrapperRect.height - boardRect.height, 0);

        const nextAreaOffset: AreaOffset = [left, top];
        setAreaOffset(nextAreaOffset);

        // 3. Up
        if (type === DragEventType.Up && (x !== left || y !== top)) {
          console.log(`[SimulationArea.useBoardDragger] sync(${left},${top})`);
          // 鼠标释放的时候同步到 redux
          const updateAreaOffset = bindActionCreators(
            updateAreaOffsetAction,
            dispatch,
          );
          updateAreaOffset({
            roomId,
            areaOffset: nextAreaOffset,
          });
        }
      }
    },
  );

  // no board drag
  if (adaptSize) {
    onBoardMouseDown = (e) => e.preventDefault();
  }

  return {
    areaOffset,
    onBoardMouseDown,
  };
};

interface SimulationAreaProps {
  areaWrapperRef: RefObject<HTMLDivElement>;
  adaptSize?: boolean;
}

const SimulationArea: FC<SimulationAreaProps> = ({
  adaptSize = SIMULATION_AREA_SHRINK,
  areaWrapperRef,
}) => {
  // redux state catch
  const simulationSpaces = useSelector(
    (state: AppState) => state.space.simulationSpaces,
  );
  const { roomId: selectedRoomId, followeeId } = useRecoilValue(
    selectedRoomInfoState,
  );
  const { list: rooms } = useSelector((state: AppState) => state.room);
  const selectedRoomIdRef = useClosestRef(selectedRoomId);
  const roomsRef = useClosestRef(rooms);

  const currentUser = useRecoilValue(currentUserTeamDataState);
  const currentUserVideoVoiceSwitch = useRecoilValue(
    userVideoVoiceSwitchFamily(currentUser.id),
  );

  const space = simulationSpaces[selectedRoomId];

  const { figures, areaOffset } = useMemo<SimulationSpace>(() => {
    if (!space) {
      return {
        figures: [],
        areaOffset: [0, 0],
      };
    }
    return space;
  }, [space]);

  // >>>>> main login
  const simulationBoardRef = useRef<HTMLDivElement>(null);
  const {
    areaOffset: [boardLeft, boardTop],
    onBoardMouseDown,
  } = useBoardDragger(areaOffset, {
    roomId: selectedRoomId,
    adaptSize,
    areaWrapperRef,
    boardRef: simulationBoardRef,
  });

  const dispatch = useDispatch();
  // mount 时加入房间, unmount 时离开房间
  useEffect(() => {
    // 未选择房间 or 未登入  => 不加入房间
    if (!selectedRoomId || !currentUser.id) {
      return;
    }
    const joinRoomSpace = bindActionCreators(joinRoomSpaceAction, dispatch);
    const leaveRoomSpace = bindActionCreators(leaveRoomSpaceAction, dispatch);

    setTimeout(() => {
      const board = simulationBoardRef.current;
      if (!board) {
        return;
      }
      const { width, height } = board.getBoundingClientRect();
      // TODO clear console
      // console.log(
      //   `[SimulationArea] simulationBoard: width = ${width}, height = ${height}`
      // );

      joinRoomSpace({
        roomId: selectedRoomId,
        figure: {
          userId: currentUser.id,
          avatar: currentUser.avatar,
          state: currentUser.state,
          position: calcInitPosition(figures, width, height, followeeId),
          active: false,
          mute: !currentUserVideoVoiceSwitch,
        },
      });
      // TODO clear console
      console.log(`[SimulationArea] back to room ${selectedRoomId}`);
    });

    return () => {
      leaveRoomSpace(selectedRoomId, currentUser.id);
      // TODO clear console
      console.log(`[SimulationArea] clear currentSapce`);
    };
  }, [selectedRoomId, followeeId, currentUser.id]);

  // 重新计算临近人物
  const figuresRef = useClosestRef(figures);
  const resetNearbyFigures = useCallback(() => {
    const figures = figuresRef.current;

    const [selfFigure] = figures.filter(
      (figure) => figure.userId === currentUser.id,
    );
    if (!selfFigure) {
      return;
    }
    const nearByFigures = calcNearbyFigures(selfFigure, figures);

    const updateNearbyFigures = bindActionCreators(
      updateNearbyFiguresAction,
      dispatch,
    );

    const room = roomsRef.current.filter(
      (room) => room.id === selectedRoomIdRef.current,
    )[0];
    updateNearbyFigures({
      room,
      figures: nearByFigures,
    });
  }, []);

  useEffect(() => {
    // update nearby figure whenever room change
    setTimeout(resetNearbyFigures);
  }, [selectedRoomId, followeeId]);

  return (
    <SimulationBoard
      style={{ left: boardLeft, top: boardTop }}
      className={classNames({ shrink: adaptSize })}
      ref={simulationBoardRef}
      onMouseDown={onBoardMouseDown}
    >
      {figures.map((figure) => (
        <Figure
          key={figure.userId}
          figure={figure}
          boardRef={simulationBoardRef}
          onFigureMove={resetNearbyFigures}
        />
      ))}
    </SimulationBoard>
  );
};

export default SimulationArea;
