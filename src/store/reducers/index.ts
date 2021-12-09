import { combineReducers } from 'redux';

import teamReducer, { Team } from './team';
import userReducer, { User } from './user';
import roomReducer, { Room } from './room';

export interface AppState {
  user: User;
  team: Team;
  room: Room;
}

const rootReducer = combineReducers({
  user: userReducer,
  team: teamReducer,
  room: roomReducer,
});

export default rootReducer;
