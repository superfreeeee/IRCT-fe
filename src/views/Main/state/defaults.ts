import { ViewPointType } from './okrDB/type';
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
export const DEFAULT_OKR_PATH_LIST_VISIBLE = false;

export const DEFAULT_OKR_VIEW_POINT_TYPE = ViewPointType.Organization;

export const DEFAULT_OKR_VIEW_POINT_CENTER_USER_ID = '';
// export const DEFAULT_OKR_VIEW_POINT_TYPE = ViewPointType.Personal;
// export const DEFAULT_OKR_VIEW_POINT_CENTER_USER_ID = 'user-01';
export const DEFAULT_OKR_PATH_TOOLTIP_POSITION = { left: 0, bottom: 0 };
export const DEFAULT_OKR_PATH_TOOLTIP_VISIBLE = false;
