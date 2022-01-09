import { Reducer } from 'redux';

import { TabOption } from '@views/Main/IM/type';
import { CommonAction } from '../type';
import { TeamActionType } from './team';
import { RoomActionType } from './room';

// =============== actions ===============
export enum SpaceActionType {
  SwitchSpace /*..........*/ = 'Space#SwitchSpace',
  ToggleSpaceVisible /*...*/ = 'Space#ToggleSpaceVisible',
  SendChatMessage /*......*/ = 'Space#SendChatMessage',
  UpdateFigurePosition /*.*/ = 'Space#UpdateFigurePosition',
  JoinRoomSpace /*........*/ = 'Space#JoinRoom',
  LeaveRoomSpace /*.......*/ = 'Space#LeaveRoomSpace',
  UpdateAreaOffset /*.....*/ = 'Space#UpdateAreaOffset',
  UpdateNearbyFigures /*..*/ = 'Space#UpdateNearbyFigures',
}

export const switchSpaceAction = (
  space: TabOption
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.SwitchSpace,
    payload: space,
  };
};

export const toggleSpaceVisibleAction = (
  visible?: boolean
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.ToggleSpaceVisible,
    payload: visible,
  };
};

interface SendChatMessageParams {
  spaceId: string;
  record: ChatRecord;
}
export const sendChatMessageAction = (
  params: SendChatMessageParams
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.SendChatMessage,
    payload: params,
  };
};

interface UpdateFigurePositionParams {
  roomId: string;
  userId: string;
  position: SpaceFigurePosition;
}

export const updateFigurePositionAction = (
  params: UpdateFigurePositionParams
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.UpdateFigurePosition,
    payload: params,
  };
};

interface UpdateAreaOffsetParams {
  roomId: string;
  areaOffset: AreaOffset;
}

export const updateAreaOffsetAction = (
  params: UpdateAreaOffsetParams
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.UpdateAreaOffset,
    payload: params,
  };
};

interface JoinRoomSpaceParams {
  roomId: string;
  figure: SpaceFigure;
}
export const joinRoomSpaceAction = (
  params: JoinRoomSpaceParams
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.JoinRoomSpace,
    payload: params,
  };
};

export const leaveRoomSpaceAction = (
  roomId: string,
  userId: string
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.LeaveRoomSpace,
    payload: {
      roomId,
      userId,
    },
  };
};

export const updateNearbyFiguresAction = (
  figures: SpaceFigureWithVideo[] = []
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.UpdateNearbyFigures,
    payload: figures,
  };
};

// =============== type ===============
/**
 * 聊天相关
 */
export interface ChatRecord {
  userId: string;
  avatar?: string;
  text: string;
}

export type ChatHistory = {
  // spaceId := teamId | roomId
  [spaceId: string]: ChatRecord[];
};

/**
 * 仿真空间相关
 */
export type SpaceFigurePosition = [number, number];

export type AreaOffset = [number, number];

export interface SpaceFigure {
  userId: string;
  avatar?: string;
  videoUrl?: string;
  position: SpaceFigurePosition;
}

export type SpaceFigureWithVideo = SpaceFigure & { voiceRate: number };

export interface SpaceChat {
  figures: SpaceFigure[];
}

export interface SimulationSpace {
  figures: SpaceFigure[];
  areaOffset: AreaOffset;
}

export type SimulationSpaceObject = {
  [roomId: string]: SimulationSpace;
};

export interface Space {
  visible: boolean;
  currentSpace: TabOption;
  teamChat: ChatHistory;
  roomChat: ChatHistory;
  simulationSpaces: SimulationSpaceObject;
  nearbyFigures: SpaceFigureWithVideo[];
}
// =============== default value creator ===============
const createSimulationSpace = (): SimulationSpace => {
  return {
    figures: [],
    areaOffset: [0, 0],
  };
};

// =============== state ===============
const initSpaceState: Space = {
  visible: true,
  currentSpace: TabOption.Team,
  teamChat: {
    'user-0': [
      {
        userId: 'user-0',
        text: '1 line -----------------------',
      },
      {
        userId: 'user-1000',
        text: '------------- 1 line',
      },
      {
        userId: 'user-0',
        text: '1 line ----------------------------\n2 line\n 3 line',
      },
      {
        userId: 'user-1000',
        text: '--------------------- 1 line',
      },
      {
        userId: 'user-1000',
        text: '------------------------------ 1 line\n2 line\n 3 line\n4 line',
      },
    ],
  },
  roomChat: {},
  simulationSpaces: {
    'room-1': {
      figures: [
        {
          userId: 'user-0',
          position: [40, 40],
        },
        {
          userId: 'user-1',
          position: [80, 80],
        },
        {
          userId: 'user-2',
          position: [120, 80],
        },
        {
          userId: 'user-3',
          position: [160, 120],
        },
      ],
      areaOffset: [0, 0],
    },
  },
  nearbyFigures: [],
};

const toggleVisible = (prevState: Space, visible?: boolean): Space => {
  if (visible === undefined) {
    visible = !prevState.visible;
  }
  return {
    ...prevState,
    visible,
  };
};

const mergeSendChatMessage = (
  prevState: Space,
  { spaceId, record }: SendChatMessageParams
): Space => {
  const chatName =
    prevState.currentSpace === TabOption.Room ? 'roomChat' : 'teamChat';
  const chatHistory = { ...prevState[chatName] };
  const oldRecords = chatHistory[spaceId] || [];
  chatHistory[spaceId] = [...oldRecords, record];

  return {
    ...prevState,
    [chatName]: chatHistory,
  };
};

const updateFigurePosition = (
  prevState: Space,
  { roomId, userId, position }: UpdateFigurePositionParams
): Space => {
  const prevSpace = prevState.simulationSpaces[roomId];
  if (!prevSpace) {
    return prevState;
  }
  const prevFigures = prevSpace.figures;
  let index = -1;
  prevFigures.forEach((figure, i) => {
    if (figure.userId === userId) {
      index = i;
    }
  });
  if (index < 0) {
    return prevState;
  }
  const newFigures = [
    ...prevFigures.slice(0, index),
    { ...prevFigures[index], position },
    ...prevFigures.slice(index + 1),
  ];
  const newState: Space = {
    ...prevState,
    simulationSpaces: {
      ...prevState.simulationSpaces,
      [roomId]: {
        ...prevSpace,
        figures: newFigures,
      },
    },
  };
  return newState;
};

const updateAreaOffset = (
  prevState: Space,
  { roomId, areaOffset }: UpdateAreaOffsetParams
) => {
  const prevSpace = prevState.simulationSpaces[roomId];
  // 不合法 room
  if (!prevSpace) {
    return prevState;
  }
  return {
    ...prevState,
    simulationSpaces: {
      ...prevState.simulationSpaces,
      [roomId]: {
        ...prevSpace,
        areaOffset,
      },
    },
  };
};

const joinRoomSpace = (
  prevState: Space,
  { roomId, figure }: JoinRoomSpaceParams
): Space => {
  const prevSpace: SimulationSpace =
    prevState.simulationSpaces[roomId] || createSimulationSpace();
  if (!prevSpace) {
    return prevState;
  }
  // 已经存在于房间内
  if (prevSpace.figures.some((f) => f.userId === figure.userId)) {
    return prevState;
  }
  return {
    ...prevState,
    simulationSpaces: {
      ...prevState.simulationSpaces,
      [roomId]: {
        ...prevSpace,
        figures: [...prevSpace.figures, figure],
      },
    },
  };
};

const leaveRoomSpace = (prevState: Space, { roomId, userId }): Space => {
  const prevSpace = prevState.simulationSpaces[roomId];
  // 不合法 room
  if (!prevSpace) {
    return prevState;
  }
  let currentUserIndex: number;
  if (
    prevSpace.figures.some((f, i) => {
      if (f.userId === userId) {
        currentUserIndex = i;
        return true;
      }
      return false;
    })
  ) {
    const prevFigures = prevSpace.figures;
    return {
      ...prevState,
      simulationSpaces: {
        ...prevState.simulationSpaces,
        [roomId]: {
          ...prevSpace,
          figures: [
            ...prevFigures.slice(0, currentUserIndex),
            ...prevFigures.slice(currentUserIndex + 1),
          ],
        },
      },
    };
  } else {
    // 不在房间内
    return prevState;
  }
};

const updateNearbyFigures = (
  prevState: Space,
  figures: SpaceFigureWithVideo[]
): Space => {
  return {
    ...prevState,
    nearbyFigures: figures,
  };
};

const spaceReducer: Reducer<
  Space,
  CommonAction<SpaceActionType | TeamActionType | RoomActionType>
> = (prevState = initSpaceState, action) => {
  switch (action.type) {
    // SpaceActionType
    case SpaceActionType.SwitchSpace:
      return { ...prevState, currentSpace: action.payload };

    case SpaceActionType.ToggleSpaceVisible:
      return toggleVisible(prevState, action.payload);

    case SpaceActionType.SendChatMessage:
      return mergeSendChatMessage(prevState, action.payload);

    case SpaceActionType.UpdateFigurePosition:
      return updateFigurePosition(prevState, action.payload);

    case SpaceActionType.UpdateAreaOffset:
      return updateAreaOffset(prevState, action.payload);

    case SpaceActionType.JoinRoomSpace:
      return joinRoomSpace(prevState, action.payload);

    case SpaceActionType.LeaveRoomSpace:
      return leaveRoomSpace(prevState, action.payload);

    case SpaceActionType.UpdateNearbyFigures:
      return updateNearbyFigures(prevState, action.payload);

    // TeamActionType, RoomActionType
    case TeamActionType.EnterTeam:
    case RoomActionType.EnterRoom:
      return toggleVisible(prevState, true);

    case TeamActionType.ExitTeam:
    case RoomActionType.ExitRoom:
      return toggleVisible(prevState, false);

    default:
      return prevState;
  }
};

export default spaceReducer;
