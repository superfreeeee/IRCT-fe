import { Reducer } from 'redux';

import { UserState } from '@components/StatusPoint/type';
import { CommonAction } from '../type';
import { SpaceActionType } from './space';

// =============== actions ===============
export enum UserActionType {}

// =============== type ===============
export interface User {
  id: string;
  avatar?: string;
  name: string;
  org: string;
  state: UserState;
  currentRoom: string; // roomId
}

// =============== state ===============
const initUserState: User = {
  id: 'user-1000',
  name: 'superfree',
  org: 'Alibaba Dingtalk',
  state: UserState.Idle,
  currentRoom: '',
};

const userReducer: Reducer<
  User,
  CommonAction<UserActionType | SpaceActionType>
> = (prevState = initUserState, action) => {
  switch (action.type) {
    case SpaceActionType.JoinRoomSpace:
      return { ...prevState, currentRoom: action.payload.roomId };

    case SpaceActionType.LeaveRoomSpace:
      return { ...prevState, currentRoom: '' };

    default:
      return prevState;
  }
};

export default userReducer;
