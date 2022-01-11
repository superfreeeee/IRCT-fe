import { Reducer } from 'redux';

import { UserState } from '@components/StatusPoint/type';
import user1000 from '@assets/img/user_1000.png';
import { CommonAction } from '../type';
import { RoomActionType, RoomData, RoomType } from './room';

// =============== actions ===============
export enum UserActionType {
  UpdateUserState = 'User#UpdateUserState',
}

export const updateUserStateAction = (
  state: UserState
): CommonAction<UserActionType> => {
  return {
    type: UserActionType.UpdateUserState,
    payload: state,
  };
};

// =============== type ===============
export interface User {
  id: string;
  avatar?: string;
  name: string;
  org: string;
  state: UserState;
}

// =============== state ===============
const initUserState: User = {
  id: 'user-1000',
  avatar: user1000,
  name: 'superfree',
  org: 'Alibaba Dingtalk',
  state: UserState.Idle,
};

const updateUserState = (prevState: User, state: UserState): User => {
  return {
    ...prevState,
    state,
  };
};

const enterNewRoom = (prevState: User, room: RoomData): User => {
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
