import { atom, selector, selectorFamily } from 'recoil';

import { AppType } from '@components/AppIcon/type';
import {
  userBasicInfoFamily,
  userCurrentRoomIdFamily,
  userStateFamily,
  userUsingAppFamily,
} from './user';
import { UserBasicInfo, UserState } from './type';

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
    ({ set }, data: TeamData) => {
      const { id, avatar, name, isGroup, videoUrl, currentRoomId, usingApp } =
        data;
      set(userBasicInfoFamily(userId), { id, avatar, name, isGroup, videoUrl });
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
