import { RoomData } from '@views/Main/state/room';
import { TeamData } from '@views/Main/state/team';

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
  lastRecordTime?: string;
}
