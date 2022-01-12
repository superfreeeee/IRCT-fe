import { RoomData } from '@store/reducers/room';
import { TeamData } from '@store/reducers/team';

import callIcon from '@assets/img/team_action_call.png';
import followIcon from '@assets/img/team_action_follow.png';
import collaborateIcon from '@assets/img/team_action_collaborate.png';

/**
 * IM - Menu Item 列表项数据
 */
export type MenuData = RoomData | TeamData;

export interface TooltipPosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface ItemExtraData {
  subtitle?: string;
  members?: number;
}

export const CALL_ICON_URL = callIcon;
export const FOLLOR_ICON_URL = followIcon;
export const COLLABORATE_ICON_URL = collaborateIcon;
