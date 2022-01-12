import { combineReducers } from 'redux';

import teamReducer, { Team } from './team';
import userReducer, { User } from './user';
import roomReducer, { Room } from './room';
import spaceReducer, { Space } from './space';
import imReducer, { IM } from './im';

export interface AppState {
  im: IM;
  user: User;
  team: Team;
  room: Room;
  space: Space;
}

const rootReducer = combineReducers({
  im: imReducer,
  user: userReducer,
  team: teamReducer,
  room: roomReducer,
  space: spaceReducer,
});

export default rootReducer;
