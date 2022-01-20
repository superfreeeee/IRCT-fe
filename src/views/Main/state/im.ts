import { atom, selector } from 'recoil';

import { AppType } from '@components/AppIcon/type';
import { UserState, TabOption, RoomType, StateNamespace } from './type';
import {
  DEFAULT_IM_TAB,
  DEFAULT_SELECTED_ROOM_ID,
  DEFAULT_SELECTED_TEAM_ID,
} from './defaults';
import { roomBasicInfoFamily } from './room';
import { okrPathVisibleState } from './okrPath';
import { createPrefixer } from './utils';

const prefixer = createPrefixer(StateNamespace.IM);

/**
 * 当前 im tab
 */
export const currentTabState = atom<TabOption>({
  key: prefixer('currentTab'),
  default: DEFAULT_IM_TAB,
});

export const selectedTeamIdBaseState = atom<string>({
  key: prefixer('selectedTeamIdBase'),
  default: DEFAULT_SELECTED_TEAM_ID,
});

/**
 * 当前选中 Team
 */
export const selectedTeamIdState = selector<string>({
  key: prefixer('selectedTeamId'),
  get: ({ get }) => get(selectedTeamIdBaseState),
  set: ({ set, get }, teamId: string) => {
    set(selectedTeamIdBaseState, teamId);

    // selectedRoomId 修改时，关闭 Path
    if (get(okrPathVisibleState)) {
      set(okrPathVisibleState, false);
    }
  },
});

export const selectedRoomIdBaseState = atom<string>({
  key: prefixer('selectedRoomIdBase'),
  default: DEFAULT_SELECTED_ROOM_ID,
});

/**
 * 当前加入 Room
 */
export const selectedRoomIdState = selector<string>({
  key: prefixer('selectedRoomId'),
  get: ({ get }) => get(selectedRoomIdBaseState),
  set: ({ set, get }, roomId: string) => {
    set(selectedRoomIdBaseState, roomId);

    // selectedRoomId 修改时，关闭 Path
    if (get(okrPathVisibleState)) {
      set(okrPathVisibleState, false);
    }
  },
});

/**
 * 当前选中房间类型
 *   dep: selectedRoomIdState
 *        roomBasicInfoFamily
 */
export const selectedRoomTypeState = selector<RoomType>({
  key: prefixer('selectedRoomType'),
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
  key: prefixer('stateTooltipVisible'),
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
  key: prefixer('stateTooltipInfo'),
  default: {
    position: { left: 215, top: 112 },
    state: UserState.Idle,
  },
});
