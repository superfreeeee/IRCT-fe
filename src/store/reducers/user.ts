import { Reducer } from 'redux';

import { UserState } from '@components/StatusPoint/type';
import { CommonAction } from '../type';
import { EnterRoomParams, RoomActionType, RoomType } from './room';

import user1000 from '@assets/img/user_1000.png';

// =============== actions ===============
export enum UserActionType {
  UpdateUserState = 'User#UpdateUserState',
  ToggleVideoVisible = 'User#ToggleVideoVisible',
  ToggleVideoVoice = 'User#ToggleVideoVoice',
}

export const updateUserStateAction = (
  state: UserState,
): CommonAction<UserActionType> => {
  return {
    type: UserActionType.UpdateUserState,
    payload: state,
  };
};

export const toggleVideoVisibleAction = (): CommonAction<UserActionType> => {
  return { type: UserActionType.ToggleVideoVisible };
};

export const toggleVideoVoiceAction = (): CommonAction<UserActionType> => {
  return { type: UserActionType.ToggleVideoVoice };
};

// =============== type ===============
export interface User {
  id: string;
  avatar?: string;
  name: string;
  state: UserState;
  videoVisible: boolean;
  videoVoice: boolean;
}

// =============== state ===============
const initUserState: User = {
  id: 'user-1000',
  avatar: user1000,
  name: 'San',
  state: UserState.Idle,
  videoVisible: true,
  videoVoice: true,
};

const updateUserState = (prevState: User, state: UserState): User => {
  return {
    ...prevState,
    state,
  };
};

const enterNewRoom = (prevState: User, { room }: EnterRoomParams): User => {
  const currentState = prevState.state;
  const state = room.type === RoomType.Coffee ? UserState.Idle : UserState.Work;
  if (currentState === state) {
    return prevState;
  }
  return updateUserState(prevState, state);
};

const userReducer: Reducer<
  User,
  CommonAction<UserActionType | RoomActionType>
> = (prevState = initUserState, action): User => {
  switch (action.type) {
    case UserActionType.UpdateUserState:
      return updateUserState(prevState, action.payload);

    case UserActionType.ToggleVideoVisible:
      return { ...prevState, videoVisible: !prevState.videoVisible };

    case UserActionType.ToggleVideoVoice:
      return { ...prevState, videoVoice: !prevState.videoVoice };

    // Room Actions
    case RoomActionType.EnterRoom:
      return enterNewRoom(prevState, action.payload);

    case RoomActionType.ExitRoom:
      return { ...prevState, state: UserState.Idle };

    default:
      return prevState;
  }
};

export default userReducer;
