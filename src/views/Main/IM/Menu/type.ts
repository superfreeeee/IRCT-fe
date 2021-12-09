import { UserState } from '@components/StatusPoint';

export interface MenuData {
  // public attr
  avatarUrl?: string;
  title: string;
  pinned?: boolean;
  // Team Mode
  state?: UserState;
  unread?: number;
  usingApp?: string;
  // Room Mode
}
