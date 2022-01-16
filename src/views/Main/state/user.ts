import { atomFamily, selector, selectorFamily } from 'recoil';

import { AppType } from '@components/AppIcon/type';
import { roomBasicInfoFamily, RoomType } from './room';
import { TeamData, teamDataFamily } from './team';

// const currentUserid = 'user_1000'
export const currentUserIdState = selector<string>({
  key: 'user_currentUserId',
  get: () => 'user-1000',
});

export interface UserBasicInfo {
  id: string;
  avatar: string;
  name: string;
  isGroup: boolean;
}
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

export enum UserState {
  Idle = 'idle',
  Busy = 'busy',
  Talking = 'talking',
  Unknown = 'unknown',
}

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
