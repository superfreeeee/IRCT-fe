import { atom, atomFamily, selector, selectorFamily } from 'recoil';

import {
  calcNearbyFigures,
  resetTalkingState,
} from '../RoomSpace/SimulationArea/utils';
import {
  RoomType,
  TabOption,
  UserBasicInfo,
  UserRoomSpaceFigure,
  UserRoomSpaceInfo,
  VideoRoomFigure,
  VideoVoiceRate,
} from './type';
import { roomBasicInfoFamily, roomIdsState, roomUserIdsFamily } from './room';
import { teamIdsState } from './team';
import {
  currentUserIdState,
  userBasicInfoFamily,
  userCurrentRoomIdFamily,
  userRoomSpaceFigureFamily,
  userRoomSpaceInfoFamily,
} from './user';
import { DEFAULT_SPACE_ID } from './defaults';
import { selectedRoomIdState, selectedRoomTypeState } from './im';

/**
 * 是否展开 RoomSpace
 */
export const expandVideoRoomState = atom({
  key: 'roomSpace_expandVideoRoom',
  default: true,
});

export interface ChatRecord {
  userId: string;
  text: string;
  createTime: string;
}

// userId/roomId => chat records
export const chatRecordsFamily = atomFamily<ChatRecord[], string>({
  key: 'roomSpace_chatRecords',
  default: [],
});

export const lastChatRecordFamily = selectorFamily<ChatRecord, string>({
  key: 'roomSpace_lastChatRecord',
  get:
    (spaceId) =>
    ({ get }) => {
      const records = get(chatRecordsFamily(spaceId));
      return records[records.length - 1];
    },
});

/**
 * 用于对 chatRecordsFamily 进行初始化
 */
export type AllChatRecords = { [spaceId: string]: ChatRecord[] };
export const allChatRecordsState = selector<AllChatRecords>({
  key: 'roomSpace_allChatRecords',
  get: ({ get }) => {
    const spaceIds = [...get(teamIdsState), ...get(roomIdsState)];
    const records = spaceIds.reduce((records, nextId) => {
      records[nextId] = get(chatRecordsFamily(nextId));
      return records;
    }, {} as AllChatRecords);
    return records;
  },
  set: ({ set }, chatRecordsMap: AllChatRecords) => {
    Object.entries(chatRecordsMap).forEach(([spaceId, records]) => {
      set(chatRecordsFamily(spaceId), records);
    });
  },
});

export interface ChatHistoryRecord extends ChatRecord {
  avatar: string;
}
// userId/roomId => chat history
export const chatHistoryFamily = selectorFamily<ChatHistoryRecord[], string>({
  key: 'roomSpace_chatHistory',
  get:
    (spaceId) =>
    ({ get }) => {
      const originRecords = get(chatRecordsFamily(spaceId));
      const records = originRecords.map((record): ChatHistoryRecord => {
        const avatar = get(userBasicInfoFamily(record.userId))?.avatar || '';
        return {
          ...record,
          avatar,
        };
      });
      return records;
    },
});

/**
 * 当前展示空间
 */
export const currentSpaceIdState = atom<string>({
  key: 'roomSpace_currentSpaceType',
  default: DEFAULT_SPACE_ID,
});

/**
 * 当前展示空间是否可见
 *   dep: currentSpaceIdState
 */
export const roomSpaceVisibleState = selector<boolean>({
  key: 'roomSpace_roomSpaceVisible',
  get: ({ get }) => !!get(currentSpaceIdState),
});

/**
 * 当前空间类型
 *   dep: currentSpaceIdState
 */
export const currentSpaceTypeState = selector<TabOption>({
  key: 'roomSpace_currentSpaceData',
  get: ({ get }) => {
    const spaceId = get(currentSpaceIdState);
    if (!spaceId) {
      return TabOption.None;
    }

    const team = get(userBasicInfoFamily(spaceId));
    if (team) {
      return TabOption.Team;
    }

    const room = get(roomBasicInfoFamily(spaceId));
    if (room) {
      return TabOption.Room;
    }

    return TabOption.None;
    // throw new Error(`spaceId: ${spaceId} belongs to no one`);
  },
});

// roomId => UserBasicInfo[]
export const roomSpaceUserBasicInfoListFamily = selectorFamily<
  UserBasicInfo[],
  string
>({
  key: 'roomSpace_roomSpaceUserBasicInfoList',
  get:
    (roomId) =>
    ({ get }) => {
      const userIds = get(roomUserIdsFamily(roomId));
      const userList = userIds.map((userId) =>
        get(userBasicInfoFamily(userId)),
      );
      return userList;
    },
});

// roomId => UserRoomSpaceInfo[]
export const roomSpaceUserSpaceInfoListFamily = selectorFamily<
  UserRoomSpaceInfo[],
  string
>({
  key: 'roomSpace_roomSpaceUserSpaceInfoList',
  get:
    (roomId) =>
    ({ get }) => {
      const userIds = get(roomUserIdsFamily(roomId));
      const userList = userIds.map((userId) =>
        get(userRoomSpaceInfoFamily(userId)),
      );
      return userList;
    },
  set:
    (roomId) =>
    ({ set, get }, userList: UserRoomSpaceInfo[]) => {
      set(
        roomUserIdsFamily(roomId),
        userList.map((user) => user.id),
      );

      const roomType = get(roomBasicInfoFamily(roomId)).type;
      const isMeeting =
        roomType === RoomType.Meeting || roomType === RoomType.TempMeeting;

      // 重新计算 Talking 状态
      const updatedUsers = isMeeting
        ? userList.map((user) => ({
            ...user,
            isTalking: true,
          }))
        : resetTalkingState(userList);

      updatedUsers.forEach((userInfo) => {
        set(userCurrentRoomIdFamily(userInfo.id), roomId);
        set(userRoomSpaceInfoFamily(userInfo.id), userInfo);
      });
    },
});

// roomId => UserRoomSpaceFigure[]
export const roomSpaceUserFigureListFamily = selectorFamily<
  UserRoomSpaceFigure[],
  string
>({
  key: 'roomSpace_roomSpaceUserFigureList',
  get:
    (roomId) =>
    ({ get }) => {
      const userIds = get(roomUserIdsFamily(roomId));
      const userFigureList = userIds.map((userId) =>
        get(userRoomSpaceFigureFamily(userId)),
      );
      return userFigureList;
    },
});

export const nearbyFiguresState = selector<VideoRoomFigure[]>({
  key: 'roomSpace_nearbyFigures',
  get: ({ get }) => {
    // Team 空间下为空
    const spaceRoomType = get(currentSpaceTypeState);
    if (spaceRoomType === TabOption.Team) {
      return [];
    }

    const roomId = get(selectedRoomIdState);
    const roomType = get(selectedRoomTypeState);
    const isMeeting =
      roomType === RoomType.Meeting || roomType === RoomType.TempMeeting;

    const userId = get(currentUserIdState); // currentUserId
    const currentFigure = get(userRoomSpaceFigureFamily(userId));
    const figures = get(roomSpaceUserFigureListFamily(roomId));

    const nearbyFigures = isMeeting
      ? // 会议室默认全开
        figures.map(
          (figure): VideoRoomFigure => ({
            ...figure,
            voiceRate: VideoVoiceRate.LEVEL1,
          }),
        )
      : // 其他空间则计算距离
        calcNearbyFigures(currentFigure, figures);

    return nearbyFigures;
  },
});

/**
 * 用于对 UserRoomSpaceInfo 初始化
 */
export type AllRoomSpaceInfo = { [roomId: string]: UserRoomSpaceInfo[] };
export const allRoomSpaceInfoState = selector<AllRoomSpaceInfo>({
  key: 'roomSpace_allRoomSpaceInfo',
  get: ({ get }) => {
    const roomIds = get(roomIdsState);
    const allInfo = roomIds.reduce((allInfo: AllRoomSpaceInfo, nextId) => {
      allInfo[nextId] = get(roomSpaceUserSpaceInfoListFamily(nextId));
      return allInfo;
    }, {});
    return allInfo;
  },
  set: ({ set }, allInfo: AllRoomSpaceInfo) => {
    Object.entries(allInfo).map(([roomId, userInfo]) => {
      set(roomSpaceUserSpaceInfoListFamily(roomId), userInfo);
    });
  },
});
