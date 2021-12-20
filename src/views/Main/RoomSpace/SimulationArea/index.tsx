import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import Figure from './Figure';
import { SimulationBoard } from './styles';
import { bindActionCreators } from 'redux';
import {
  joinRoomSpaceAction,
  leaveRoomSpaceAction,
} from '@store/reducers/space';
import { calcInitPosition } from './utils';

const SimulationArea = () => {
  const simulationSpaces = useSelector(
    (state: AppState) => state.space.simulationSpaces
  );
  const selectedRoomId = useSelector((state: AppState) => state.room.selected);
  const user = useSelector((state: AppState) => state.user);

  const space = simulationSpaces[selectedRoomId];

  const { figures, chats } = useMemo(() => {
    if (!space) {
      return {
        figures: [],
        chats: [],
      };
    }
    return space;
  }, [space]);

  const simulationBoardRef = useRef<HTMLDivElement>(null);

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
      const { width, height } =
        simulationBoardRef.current.getBoundingClientRect();
      console.log(
        `[SimulationArea] simulationBoard: width = ${width}, height = ${height}`
      );

      joinRoomSpace({
        roomId: selectedRoomId,
        figure: {
          userId: user.id,
          avatar: user.avatar,
          position: calcInitPosition(width, height),
        },
      });
    });

    return () => {
      leaveRoomSpace(selectedRoomId, user.id);
    };
  }, [selectedRoomId, user]);

  return (
    <SimulationBoard ref={simulationBoardRef} className={'shrink'}>
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
