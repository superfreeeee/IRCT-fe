import { atom, selector, selectorFamily } from 'recoil';

import { AppType } from '@components/AppIcon/type';
import {
  UserBasicInfo,
  userBasicInfoFamily,
  userCurrentRoomIdFamily,
  userStateFamily,
  userUsingAppFamily,
  UserState,
} from './user';

export interface TeamData extends UserBasicInfo {
  state?: UserState;
  usingApp?: AppType;
  currentRoomId?: string;
}
// userId => TeamData
export const teamDataFamily = selectorFamily<TeamData, string>({
  key: 'team_teamData',
  get:
    (userId) =>
    ({ get }) => {
      const basicInfo = get(userBasicInfoFamily(userId));
      const state = get(userStateFamily(userId));
      const usingApp = get(userUsingAppFamily(userId));
      const currentRoomId = get(userCurrentRoomIdFamily(userId));

      const teamData: TeamData = {
        ...basicInfo,
        state,
        usingApp,
        currentRoomId,
      };

      return teamData;
    },
  set:
    (userId) =>
    ({ set, get }, data: TeamData) => {
      const { id, avatar, name, isGroup, currentRoomId, usingApp } = data;
      set(userBasicInfoFamily(userId), { id, avatar, name, isGroup });
      set(userCurrentRoomIdFamily(userId), currentRoomId);
      set(userUsingAppFamily(userId), usingApp);
    },
});

// 当前 team 列表中数据
export const teamIdsState = atom<string[]>({
  key: 'team_teamIds',
  default: [],
});

export const teamDataListState = selector<TeamData[]>({
  key: 'team_teamDataList',
  get: ({ get }) => {
    const teamIds = get(teamIdsState);
    const teamDataList = teamIds.map((teamId) => get(teamDataFamily(teamId)));
    return teamDataList;
  },
  set: ({ set }, teamDataList: TeamData[]) => {
    set(
      teamIdsState,
      teamDataList.map((data) => data.id),
    );
    teamDataList.forEach((data) => {
      set(teamDataFamily(data.id), data);
    });
  },
});
