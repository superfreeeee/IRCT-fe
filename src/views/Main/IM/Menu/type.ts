import { RoomData } from '@store/reducers/room';
import { TeamData } from '@store/reducers/team';

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
