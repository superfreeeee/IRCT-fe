import { atomFamily, selector, selectorFamily } from 'recoil';

import { AppType } from '@components/AppIcon/type';
import { roomBasicInfoFamily } from './room';
import {
  RoomType,
  UserBasicInfo,
  UserRoomSpaceFigure,
  UserRoomSpaceInfo,
} from './type';
import { TeamData, teamDataFamily } from './team';
import { RoomSpacePosition, UserState } from './type';

// const currentUserid = 'user_1000'
export const currentUserIdState = selector<string>({
  key: 'user_currentUserId',
  get: () => 'user-1000',
});

// userId => UserBasicInfo 用户基本信息
export const userBasicInfoFamily = atomFamily<UserBasicInfo | null, string>({
  key: 'user_userBasicInfo',
  default: null,
});

// userId => currentRoomId
export const userCurrentRoomIdFamily = atomFamily<string, string>({
  key: 'user_userCurrentRoomId',
  default: '',
});

// userId => talkingState 对话状态
export const userTalkingStateFamily = atomFamily<boolean, string>({
  key: 'user_userTalking',
  default: false,
});

// for figure move updating
interface UserTalkingStateUpdate {
  userId: string;
  isTalking: boolean;
}
export const userTalkingListState = selector<UserTalkingStateUpdate[]>({
  key: 'user_userTalkingList',
  get: () => [], // shall get nothing
  set: ({ set }, userUpdateList: UserTalkingStateUpdate[]) => {
    userUpdateList.forEach(({ userId, isTalking }) => {
      set(userTalkingStateFamily(userId), isTalking);
    });
  },
});

// userId => AppType 当前正在使用 App
export const userUsingAppFamily = atomFamily<AppType, string>({
  key: 'user_userUsingApp',
  default: AppType.None,
});

// userId => customBusy state 自定义忙碌状态
export const userCustomBusyFamily = atomFamily({
  key: 'user_userCustomBusy',
  default: false,
});

// userid => UserState
export const userStateFamily = selectorFamily<UserState, string>({
  key: 'user_userState',
  get:
    (userId) =>
    ({ get }) => {
      const basicInfo = get(userBasicInfoFamily(userId));
      if (!basicInfo || basicInfo.isGroup) {
        return UserState.Unknown;
      }
      const currentRoomId = get(userCurrentRoomIdFamily(userId));
      const isTalking = get(userTalkingStateFamily(userId));

      if (currentRoomId && isTalking) {
        // In some room && isTalking
        const room = get(roomBasicInfoFamily(currentRoomId));
        const isIdelRoom = room.type === RoomType.Coffee;
        return isIdelRoom ? UserState.Idle : UserState.Talking;
      } else {
        // Not in room
        const usingApp = get(userUsingAppFamily(userId));
        const customBusy = get(userCustomBusyFamily(userId));
        return usingApp || customBusy ? UserState.Busy : UserState.Idle;
      }
    },
});

/**
 * 获取当前用户信息
 *   dep: teamDataFamily
 */
export const currentUserTeamDataState = selector<TeamData>({
  key: 'user_currentUserInfo',
  get: ({ get }) => {
    const uid = get(currentUserIdState); // currentUserId
    return get(teamDataFamily(uid));
  },
});

// userId => videoVisible 用户视频开放状态
export const userVideoVisibleFamily = atomFamily<boolean, string>({
  key: 'user_userVideoVisible',
  default: true,
});

// userId => videoVoiceSwitch 用户语音开放状态
export const userVideoVoiceSwitchFamily = atomFamily<boolean, string>({
  key: 'user_userVideoVoiceSwitch',
  default: true,
});

interface UserVideoRoomSetting {
  videoVisible: boolean;
  videoVoiceSwitch: boolean;
}
/**
 * 用户会议室设置状态
 *   dep: userVideoVisibleFamily
 *        userVideoVoiceSwitchFamily
 */
export const userVideoRoomSettingFamily = selectorFamily<
  UserVideoRoomSetting,
  string
>({
  key: 'user_userVideoRoomSetting',
  get:
    (userId) =>
    ({ get }) => {
      const videoVisible = get(userVideoVisibleFamily(userId));
      const videoVoiceSwitch = get(userVideoVoiceSwitchFamily(userId));
      return { videoVisible, videoVoiceSwitch };
    },
});

/**
 * 空间中所处位置信息
 */
export const userRoomSpacePositionFamily = atomFamily<
  RoomSpacePosition,
  string
>({
  key: 'user_userRoomPosition',
  default: [0, 0],
});

// userId => UserRoomSpaceInfo
export const userRoomSpaceInfoFamily = selectorFamily<
  UserRoomSpaceInfo,
  string
>({
  key: 'user_userRoomSpaceInfo',
  get:
    (userId) =>
    ({ get }) => {
      const state = get(userStateFamily(userId));
      const position = get(userRoomSpacePositionFamily(userId));
      const isTalking = get(userTalkingStateFamily(userId));
      const mute = get(userVideoVoiceSwitchFamily(userId));
      const info: UserRoomSpaceInfo = {
        id: userId,
        state,
        position,
        isTalking,
        mute,
      };
      return info;
    },
  set:
    (userId) =>
    ({ set }, { position, isTalking, mute }: UserRoomSpaceInfo) => {
      set(userRoomSpacePositionFamily(userId), position);
      set(userTalkingStateFamily(userId), isTalking);
      set(userVideoVoiceSwitchFamily(userId), !mute);
    },
});

// userId => UserRoomSpaceFigure
export const userRoomSpaceFigureFamily = selectorFamily<
  UserRoomSpaceFigure,
  string
>({
  key: 'user_userRoomSpaceFigure',
  get:
    (userId) =>
    ({ get }) => {
      const basicInfo = get(userBasicInfoFamily(userId));
      const spaceInfo = get(userRoomSpaceInfoFamily(userId));

      const figureInfo: UserRoomSpaceFigure = {
        ...basicInfo,
        ...spaceInfo,
      };
      return figureInfo;
    },
});
