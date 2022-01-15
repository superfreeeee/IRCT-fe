import { Reducer } from 'redux';

import { TabOption } from '@views/Main/IM/type';
import { resetActiveStates } from '@views/Main/RoomSpace/SimulationArea/utils';
import { UserState } from '@components/StatusPoint/type';
import { CommonAction } from '../type';
import { TeamActionType } from './team';
import { RoomActionType } from './room';

import user0Avatar from '@assets/img/user_0.png';
import user1Avatar from '@assets/img/user_1.png';
import user2Avatar from '@assets/img/user_2.png';
import user5Avatar from '@assets/img/user_5.png';
import user7Avatar from '@assets/img/user_7.png';
import user9Avatar from '@assets/img/user_9.png';
import user12Avatar from '@assets/img/user_12.png';
import user13Avatar from '@assets/img/user_13.png';
import user14Avatar from '@assets/img/user_14.png';
import user15Avatar from '@assets/img/user_15.png';
import selfAvatar from '@assets/img/user_1000.png';

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
  space: TabOption,
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.SwitchSpace,
    payload: space,
  };
};

export const toggleSpaceVisibleAction = (
  visible?: boolean,
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
  params: SendChatMessageParams,
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
  params: UpdateFigurePositionParams,
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
  params: UpdateAreaOffsetParams,
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
  params: JoinRoomSpaceParams,
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.JoinRoomSpace,
    payload: params,
  };
};

export const leaveRoomSpaceAction = (
  roomId: string,
  userId: string,
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.LeaveRoomSpace,
    payload: {
      roomId,
      userId,
    },
  };
};

interface UpdateNearbyFiguresParams {
  roomId: string;
  figures: SpaceFigureWithVideo[];
}
export const updateNearbyFiguresAction = (
  params: UpdateNearbyFiguresParams,
): CommonAction<SpaceActionType> => {
  return {
    type: SpaceActionType.UpdateNearbyFigures,
    payload: params,
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
  createTime: string;
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
  state: UserState;
  videoUrl?: string;
  position: SpaceFigurePosition;
  active: boolean;
  mute: boolean;
}

export enum VideoVoiceRate {
  LEVEL1 = 100,
  LEVEL2 = 60,
  LEVEL3 = 20,
  LEVEL4 = 0,
}

export type SpaceFigureWithVideo = SpaceFigure & { voiceRate: VideoVoiceRate };

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
        userId: 'user-1000',
        text: 'I want to find you to understand some of the details of the relevant PRD, it will not be too long',
        avatar: selfAvatar,
        createTime: '12:27',
      },
      {
        userId: 'user-0',
        text: "Ok let's talk, I'm at Coffee Bar now, Plz follow me",
        avatar: user0Avatar,
        createTime: '12:30',
      },
    ],
    'user-1': [
      {
        userId: 'user-1000',
        text: 'How is your design going?',
        avatar: selfAvatar,
        createTime: '11:44',
      },
      {
        userId: 'user-1',
        text: 'Not bad, you can take a look at my recent goals on Path, and you can talk about it later',
        avatar: user1Avatar,
        createTime: '11:45',
      },
    ],
    'user-2': [
      {
        userId: 'user-1000',
        text: 'Hi, are u the PM for Project A?',
        avatar: selfAvatar,
        createTime: '11:33',
      },
      {
        userId: 'user-2',
        text: 'Yes, is there any problem?',
        avatar: user2Avatar,
        createTime: '11:34',
      },
    ],
    'user-3': [
      {
        userId: 'user-12',
        text: 'Please all PM give the ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?',
        avatar: user12Avatar,
        createTime: '14:01',
      },
    ],
    'user-5': [
      {
        userId: 'user-1000',
        text: 'This software is so much fun',
        avatar: selfAvatar,
        createTime: '11:14',
      },
      {
        userId: 'user-5',
        text: 'Lollllll',
        avatar: user5Avatar,
        createTime: '11:15',
      },
    ],
    'user-7': [
      {
        userId: 'user-1000',
        text: 'Where are you, there is a technical question you would like to ask',
        avatar: selfAvatar,
        createTime: '10:57',
      },
      {
        userId: 'user-7',
        text: 'Something is wrong with my computer and I checked it here',
        avatar: user7Avatar,
        createTime: '10:58',
      },
    ],
    'user-9': [
      {
        userId: 'user-9',
        text: 'get lunch together?',
        avatar: user9Avatar,
        createTime: '10:23',
      },
    ],
    'user-12': [
      {
        userId: 'user-1000',
        text: 'I have some questions I would like to consult',
        avatar: selfAvatar,
        createTime: '10:11',
      },
      {
        userId: 'user-12',
        text: 'We can have a conversation...',
        avatar: user12Avatar,
        createTime: '10:12',
      },
    ],
    'user-13': [
      {
        userId: 'user-1000',
        text: "Sorry, I can't go to the afternoon meeting later",
        avatar: selfAvatar,
        createTime: '09:33',
      },
      {
        userId: 'user-13',
        text: 'Ok, Thats fine',
        avatar: user13Avatar,
        createTime: '09:34',
      },
    ],
    'user-14': [
      {
        userId: 'user-1000',
        text: 'Where are you, there is a technical question you would like to ask',
        avatar: selfAvatar,
        createTime: '10:54',
      },
      {
        userId: 'user-14',
        text: 'Something is wrong with my computer and I checked it here',
        avatar: user14Avatar,
        createTime: '10:55',
      },
    ],
    'user-15': [
      {
        userId: 'user-1000',
        text: "I see you this month Objective and feel like there's some place to collaborate",
        avatar: selfAvatar,
        createTime: '13:20',
      },
      {
        userId: 'user-15',
        text: 'No problem, wait until I finish updating the code café to see',
        avatar: user15Avatar,
        createTime: '13:22',
      },
    ],
  },
  roomChat: {},
  simulationSpaces: {
    'room-1': {
      figures: [
        {
          userId: 'user-0',
          avatar: user0Avatar,
          state: UserState.Idle,
          position: [80, 80],
          active: true,
          mute: false,
        },
        {
          userId: 'user-15',
          avatar: user15Avatar,
          state: UserState.Busy,
          position: [220, 150],
          active: true,
          mute: true,
        },
      ],
      areaOffset: [0, 0],
    },
    'room-5': {
      figures: [
        {
          userId: 'user-1',
          avatar: user1Avatar,
          state: UserState.Work,
          position: [80, 80],
          active: true,
          mute: false,
        },
        {
          userId: 'user-5',
          avatar: user5Avatar,
          state: UserState.Busy,
          position: [220, 150],
          active: true,
          mute: false,
        },
      ],
      areaOffset: [0, 0],
    },
    'room-11': {
      figures: [
        {
          userId: 'user-2',
          avatar: user2Avatar,
          state: UserState.Busy,
          position: [80, 80],
          active: true,
          mute: false,
        },
        {
          userId: 'user-9',
          avatar: user9Avatar,
          state: UserState.Busy,
          position: [220, 150],
          active: true,
          mute: false,
        },
      ],
      areaOffset: [0, 0],
    },
    'room-4': {
      figures: [
        {
          userId: 'user-7',
          avatar: user7Avatar,
          state: UserState.Busy,
          position: [80, 80],
          active: true,
          mute: false,
        },
        {
          userId: 'user-14',
          avatar: user14Avatar,
          state: UserState.Busy,
          position: [220, 150],
          active: true,
          mute: false,
        },
      ],
      areaOffset: [0, 0],
    },
    'room-0': {
      figures: [
        {
          userId: 'user-12',
          avatar: user12Avatar,
          state: UserState.Busy,
          position: [80, 80],
          active: true,
          mute: false,
        },
        {
          userId: 'user-13',
          avatar: user13Avatar,
          state: UserState.Busy,
          position: [220, 150],
          active: true,
          mute: false,
        },
      ],
      areaOffset: [0, 0],
    },
  },
  nearbyFigures: [],
};

const switchSpace = (prevState: Space, space: TabOption): Space => {
  const currentSpace = prevState.currentSpace;
  if (currentSpace === space) {
    return prevState;
  }
  return {
    ...prevState,
    currentSpace: space,
  };
};

const toggleVisible = (prevState: Space, visible?: boolean): Space => {
  if (visible === undefined) {
    visible = !prevState.visible;
  } else if (prevState.visible === visible) {
    return prevState;
  }
  return {
    ...prevState,
    visible,
  };
};

const appendChatMessage = (
  prevState: Space,
  { spaceId, record }: SendChatMessageParams,
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
  { roomId, userId, position }: UpdateFigurePositionParams,
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
  { roomId, areaOffset }: UpdateAreaOffsetParams,
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
  { roomId, figure }: JoinRoomSpaceParams,
): Space => {
  const prevSpace: SimulationSpace =
    prevState.simulationSpaces[roomId] || createSimulationSpace();
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
  { roomId, figures }: UpdateNearbyFiguresParams,
): Space => {
  const prevSpaces = prevState.simulationSpaces;
  const prevRoomSpace = prevSpaces[roomId];
  const newFigures = resetActiveStates(prevRoomSpace.figures);
  return {
    ...prevState,
    simulationSpaces: {
      ...prevSpaces,
      [roomId]: {
        ...prevRoomSpace,
        figures: newFigures,
      },
    },
    nearbyFigures: figures,
  };
};

const spaceReducer: Reducer<
  Space,
  CommonAction<SpaceActionType | TeamActionType | RoomActionType>
> = (prevState = initSpaceState, action): Space => {
  switch (action.type) {
    // SpaceActionType
    case SpaceActionType.SwitchSpace:
      return switchSpace(prevState, action.payload);

    case SpaceActionType.ToggleSpaceVisible:
      return toggleVisible(prevState, action.payload);

    case SpaceActionType.SendChatMessage:
      return appendChatMessage(prevState, action.payload);

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
      return toggleVisible(prevState, action.payload);

    default:
      return prevState;
  }
};

export default spaceReducer;
