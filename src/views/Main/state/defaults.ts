import { TabOption } from './type';

export const DEFAULT_IM_TAB = TabOption.Room;
export const DEFAULT_SELECTED_TEAM_ID = '';
export const DEFAULT_SELECTED_ROOM_ID = 'room-0';

export const DEFAULT_SPACE_ID =
  DEFAULT_IM_TAB === TabOption.Room
    ? DEFAULT_SELECTED_ROOM_ID
    : DEFAULT_SELECTED_TEAM_ID;
