import React, {
  FC,
  RefObject,
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
} from '@store/reducers/space';
import { roundBy } from '@utils';
import useDragPosition, { DragEventType } from '@hooks/useDragPosition';
import Figure from './Figure';
import { SimulationBoard } from './styles';
import { calcInitPosition } from './utils';

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
  { roomId, adaptSize, areaWrapperRef, boardRef }: UseBoardDraggerOptions
) => {
  const [areaOffset, setAreaOffset] = useState<AreaOffset>(initOffset);

  const boardRectRef = useRef<DOMRect>(null);
  const prevOffsetRef = useRef<AreaOffset>(null);
  const dispatch = useDispatch();
  let { onMouseDown: onBoardMouseDown } = useDragPosition(
    (_, { type, dx, dy }) => {
      if (type === DragEventType.Down) {
        prevOffsetRef.current = areaOffset;
      } else {
        if (!boardRectRef.current) {
          boardRectRef.current = boardRef.current.getBoundingClientRect();
        }
        const boardRect = boardRectRef.current;
        const wrapperRect = areaWrapperRef.current.getBoundingClientRect();

        // TODO clear console
        console.log(
          `[Room.onWrapperMouseDown] ${type}(dx, dy) = (${dx}, ${dy})`
        );
        const [x, y] = prevOffsetRef.current;

        const left = roundBy(x + dx, wrapperRect.width - boardRect.width, 0);
        const top = roundBy(y + dy, wrapperRect.height - boardRect.height, 0);

        const nextAreaOffset: AreaOffset = [left, top];
        setAreaOffset(nextAreaOffset);

        if (type === DragEventType.Up) {
          // 鼠标释放的时候同步到 redux
          const updateAreaOffset = bindActionCreators(
            updateAreaOffsetAction,
            dispatch
          );
          updateAreaOffset({
            roomId,
            areaOffset: nextAreaOffset,
          });
        }
      }
    }
  );

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
  adaptSize = false,
  areaWrapperRef,
}) => {
  // redux state catch
  const simulationSpaces = useSelector(
    (state: AppState) => state.space.simulationSpaces
  );
  const selectedRoomId = useSelector((state: AppState) => state.room.selected);
  const user = useSelector((state: AppState) => state.user);

  const space = simulationSpaces[selectedRoomId];

  const { figures, chats, areaOffset } = useMemo<SimulationSpace>(() => {
    if (!space) {
      return {
        figures: [],
        chats: [],
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

  // TODO clear console
  useEffect(() => {
    console.log('[SimulationArea] figures', figures);
  }, [figures]);

  const dispatch = useDispatch();
  // mount 时加入房间, unmount 时离开房间
  useEffect(() => {
    // 未选择房间 or 未登入  => 不加入房间
    if (!selectedRoomId || !user.id) {
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
      console.log(
        `[SimulationArea] simulationBoard: width = ${width}, height = ${height}`
      );

      joinRoomSpace({
        roomId: selectedRoomId,
        figure: {
          userId: user.id,
          avatar: user.avatar,
          position: calcInitPosition(figures, width, height),
        },
      });
      console.log(`join room ${selectedRoomId}`);
    });

    return () => {
      leaveRoomSpace(selectedRoomId, user.id);
      console.log(`leave room ${selectedRoomId}`);
    };
  }, [selectedRoomId, user.id]);

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
        />
      ))}
    </SimulationBoard>
  );
};

export default SimulationArea;
