import { atom, selector } from 'recoil';

import { AppType } from '@components/AppIcon/type';
import { UserState } from './type';
import {
  DEFAULT_IM_TAB,
  DEFAULT_SELECTED_ROOM_ID,
  DEFAULT_SELECTED_TEAM_ID,
} from './defaults';
import { TabOption } from './type';
import { roomBasicInfoFamily } from './room';
import { RoomType } from './type';

/**
 * 当前 im tab
 */
export const currentTabState = atom<TabOption>({
  key: 'im_currentTab',
  default: DEFAULT_IM_TAB,
});

/**
 * 当前选中 Team
 */
export const selectedTeamIdState = atom<string>({
  key: 'im_selectedTeamId',
  default: DEFAULT_SELECTED_TEAM_ID,
});

/**
 * 当前加入 Room
 */
export const selectedRoomIdState = atom<string>({
  key: 'im_selectedRoomId',
  default: DEFAULT_SELECTED_ROOM_ID,
});

/**
 * 当前选中房间类型
 *   dep: selectedRoomIdState
 *        roomBasicInfoFamily
 */
export const selectedRoomTypeState = selector<RoomType>({
  key: 'im_selectedRoomType',
  get: ({ get }) => {
    const roomId = get(selectedRoomIdState);
    const room = get(roomBasicInfoFamily(roomId));
    return room ? room.type : RoomType.None;
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
