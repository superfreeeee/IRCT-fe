import { atom, atomFamily, selector, selectorFamily } from 'recoil';

import { TabOption } from './type';
import { roomBasicInfoFamily, roomIdsState } from './room';
import { teamIdsState } from './team';
import { userBasicInfoFamily } from './user';
import { DEFAULT_SPACE_ID } from './defaults';

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
    (id) =>
    ({ get }) => {
      const originRecords = get(chatRecordsFamily(id));
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

export const roomSpaceVisibleState = selector<boolean>({
  key: 'roomSpace_roomSpaceVisible',
  get: ({ get }) => !!get(currentSpaceIdState),
});

// 当前空间类型
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
