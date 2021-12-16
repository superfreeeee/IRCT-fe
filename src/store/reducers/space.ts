import { Reducer } from 'redux';

import { TabOption } from '@views/Main/IM/type';
import { TeamActionType } from './team';
import { RoomActionType } from './room';

// =============== actions ===============
export enum SpaceActionType {
  SwitchSpace = 'Space#SwitchSpace',
  ToggleSpaceVisible = 'Space#ToggleSpaceVisible',
  SendChatMessage = 'Space#SendChatMessage',
}

export const switchSpaceAction = (space: TabOption) => {
  return {
    type: SpaceActionType.SwitchSpace,
    payload: space,
  };
};

export const toggleSpaceVisibleAction = (visible?: boolean) => {
  return {
    type: SpaceActionType.ToggleSpaceVisible,
    payload: visible,
  };
};

interface SendChatMessageParams {
  spaceId: string;
  record: ChatRecord;
}
export const sendChatMessageAction = (params: SendChatMessageParams) => {
  return {
    type: SpaceActionType.SendChatMessage,
    payload: params,
  };
};

// =============== type ===============
export interface ChatRecord {
  userId: string;
  avatar?: string;
  text: string;
}

export type ChatHistory = {
  // spaceId := teamId | roomId
  [spaceId: string]: ChatRecord[];
};

export interface Space {
  visible: boolean;
  currentSpace: TabOption;
  teamChat: ChatHistory;
  roomChat: ChatHistory;
}

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
};

const toggleVisible = (prevState: Space, visible?: boolean) => {
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
) => {
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

const spaceReducer: Reducer<Space> = (prevState = initSpaceState, action) => {
  switch (action.type) {
    case SpaceActionType.SwitchSpace:
      return { ...prevState, currentSpace: action.payload };

    case SpaceActionType.ToggleSpaceVisible:
      return toggleVisible(prevState, action.payload);

    case SpaceActionType.SendChatMessage:
      return mergeSendChatMessage(prevState, action.payload);

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
