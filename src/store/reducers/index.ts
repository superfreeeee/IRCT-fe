import { combineReducers } from 'redux';

import teamReducer, { Team } from './team';
import roomReducer, { Room } from './room';
import spaceReducer, { Space } from './space';

export interface AppState {
  team: Team;
  room: Room;
  space: Space;
}

const rootReducer = combineReducers({
  team: teamReducer,
  room: roomReducer,
  space: spaceReducer,
});

export default rootReducer;
