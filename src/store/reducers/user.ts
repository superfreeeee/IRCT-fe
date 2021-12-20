import { Reducer } from 'redux';

import { UserState } from '@components/StatusPoint/type';
import { CommonAction } from '../type';

// =============== actions ===============
export enum UserActionType {}

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
  name: 'superfree',
  org: 'Alibaba Dingtalk',
  state: UserState.Idle,
};

const userReducer: Reducer<User, CommonAction<UserActionType>> = (
  prevState = initUserState,
  action
) => {
  return prevState;
};

export default userReducer;
