import { UserState } from '@components/StatusPoint/type';

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
