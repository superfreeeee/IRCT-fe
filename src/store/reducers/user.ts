import { Reducer } from 'redux';

import { UserState } from '@components/StatusPoint/type';

// =============== actions ===============
export enum UserActionType {}

// =============== type ===============
export interface User {
  id: string;
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

const userReducer: Reducer<User> = (prevState = initUserState, action) => {
  return prevState;
};

export default userReducer;
