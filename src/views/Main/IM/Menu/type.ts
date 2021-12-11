import { UserState } from '@components/StatusPoint/type';

/**
 * IM - Menu Item 列表项数据
 */
export interface MenuData {
  // public attr
  avatarUrl?: string;
  pinned?: boolean;
  title: string;
  // Team Mode
  state?: UserState;
  unread?: number;
  usingApp?: string;
  // Room Mode
}

export interface TooltipPosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}
