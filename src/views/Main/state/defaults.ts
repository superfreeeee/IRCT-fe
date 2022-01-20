import { TabOption } from './type';

/**
 * defaults for im
 */
export const DEFAULT_IM_TAB = TabOption.Room;

export const DEFAULT_SELECTED_TEAM_ID = '';
export const DEFAULT_SELECTED_ROOM_ID = 'room-0';

/**
 * defaults for roomSpace
 */
export const DEFAULT_EXPAND_VIDEO_ROOM = true;

export const DEFAULT_SPACE_ID =
  DEFAULT_IM_TAB === TabOption.Room
    ? DEFAULT_SELECTED_ROOM_ID
    : DEFAULT_SELECTED_TEAM_ID;

/**
 * defaults for okrPath
 */
export const DEFAULT_OKR_PATH_VISIBLE = true;
export const DEFAULT_OKR_List_VISIBLE = false;
