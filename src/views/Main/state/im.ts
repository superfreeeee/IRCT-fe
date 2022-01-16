import { atom, selector } from 'recoil';

import { AppType } from '@components/AppIcon/type';
import { UserState } from './user';

export enum TabOption {
  Room = 'Room',
  Team = 'Team',
  None = 'None',
}

/**
 * 当前 im tab
 */
export const currentTabState = atom<TabOption>({
  key: 'im_currentTab',
  default: TabOption.Room,
});

/**
 * 当前选中 Team
 */
export const selectedTeamIdState = atom<string>({
  key: 'im_selectedTeamId',
  default: '',
});

/**
 * 当前加入 Room
 */
export const selectedRoomIdState = atom<string>({
  key: 'im_selectedRoomId',
  default: '',
});

/**
 * 加入 Room 时跟踪对象
 */
export const selectedRoomFolloweeIdState = atom<string>({
  key: 'im_selectedRoomFollowee',
  default: '',
});

interface SelectedRoomInfo {
  roomId: string;
  followeeId: string;
}
/**
 * 当前选中 Room = roomId + followeeId
 */
export const selectedRoomInfoState = selector<SelectedRoomInfo>({
  key: 'im_selectedRoomInfo',
  get: ({ get }) => {
    const roomId = get(selectedRoomIdState);
    const followeeId = get(selectedRoomFolloweeIdState);
    return { roomId, followeeId };
  },
  set: ({ set }, { roomId, followeeId }: SelectedRoomInfo) => {
    set(selectedRoomIdState, roomId);
    set(selectedRoomFolloweeIdState, followeeId);
  },
});

/**
 * 用户状态 tooltip
 */
export const stateTooltipVisibleState = atom({
  key: 'im_stateTooltipVisible',
  default: false,
});

export interface StateTooltipInfo {
  position: {
    left: number;
    top: number;
  };
  state: UserState;
  room?: string;
  usingApp?: AppType;
}

export const stateTooltipInfoState = atom<StateTooltipInfo>({
  key: 'im_stateTooltipInfo',
  default: {
    position: { left: 215, top: 112 },
    state: UserState.Idle,
  },
});
