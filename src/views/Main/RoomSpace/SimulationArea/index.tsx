import React, { FC, RefObject, useCallback, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import { selectedRoomIdState } from '@views/Main/state/im';
import { userTalkingListState } from '@views/Main/state/user';
import { roomSpaceUserFigureListFamily } from '@views/Main/state/roomSpace';
import { RoomSpacePosition } from '@views/Main/state/type';
import useClosestRef from '@hooks/useClosestRef';
import Figure from './Figure';
import { SimulationBoard } from './styles';
import { resetTalkingState } from './utils';
import { SIMULATION_AREA_SHRINK } from './config';

interface SimulationAreaProps {
  areaWrapperRef: RefObject<HTMLDivElement>;
  adaptSize?: boolean;
}

const SimulationArea: FC<SimulationAreaProps> = ({
  adaptSize = SIMULATION_AREA_SHRINK,
}) => {
  // 当前选中房间信息
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  // 当前房间人物列表
  const figureList = useRecoilValue(
    roomSpaceUserFigureListFamily(selectedRoomId),
  );
  const figureListLive = useClosestRef(figureList);

  // >>>>> main login
  const simulationBoardRef = useRef<HTMLDivElement>(null);

  const setUserTalkingList = useSetRecoilState(userTalkingListState);
  // 任何角色移动时，同步其他角色 talking 状态
  const updateTalkingState = useCallback(
    (userId: string, position: RoomSpacePosition) => {
      const figures = figureListLive.current.map((figure) => {
        if (figure.id === userId) {
          // 更新当前用户 position
          return {
            ...figure,
            position,
          };
        } else {
          return figure;
        }
      });
      const userUpdates = resetTalkingState(figures).map(
        ({ id, isTalking }) => ({
          userId: id,
          isTalking,
        }),
      );
      setUserTalkingList(userUpdates);
    },
    [],
  );

  // 每次进入新房间的第一次渲染更新 talking
  useEffect(() => {
    // SimulationArea 不会是 MeetingRoom
    const userUpdates = resetTalkingState(figureList).map(
      ({ id, isTalking }) => ({
        userId: id,
        isTalking,
      }),
    );
    setUserTalkingList(userUpdates);
  }, [selectedRoomId]);

  return (
    <SimulationBoard
      style={{ left: 0, top: 0 }}
      className={classNames({ shrink: adaptSize })}
      ref={simulationBoardRef}
    >
      {figureList.map((figure) => (
        <Figure
          key={figure.id}
          figure={figure}
          boardRef={simulationBoardRef}
          onFigureMove={updateTalkingState}
        />
      ))}
    </SimulationBoard>
  );
};

export default SimulationArea;
