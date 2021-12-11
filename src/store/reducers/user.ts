import { Reducer } from 'redux';

import { UserState } from '@components/StatusPoint/type';

export interface User {
  name: string;
  org: string;
  state: UserState;
}

const initUserState: User = {
  name: 'superfree',
  org: 'Alibaba Dingtalk',
  state: UserState.Idle,
};

const userReducer: Reducer<User> = (prevState = initUserState, action) => {
  return prevState;
};

export default userReducer;
