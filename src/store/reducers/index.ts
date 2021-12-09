import { combineReducers } from 'redux';

import userReducer, { User } from './user';

export interface AppState {
  user: User;
}

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
