import { combineReducers } from 'redux';

import teamReducer, { Team } from './team';
import userReducer, { User } from './user';
import roomReducer, { Room } from './room';
import spaceReducer, { Space } from './space';

export interface AppState {
  user: User;
  team: Team;
  room: Room;
  space: Space;
}

const rootReducer = combineReducers({
  user: userReducer,
  team: teamReducer,
  room: roomReducer,
  space: spaceReducer,
});

export default rootReducer;
