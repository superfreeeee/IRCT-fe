import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { RoomType } from './type';

interface RoomBasicInfo {
  id: string;
  type: RoomType;
  avatar: string;
  title: string;
}
// roomId => RoomBasicInfo
export const roomBasicInfoFamily = atomFamily<RoomBasicInfo, string>({
  key: 'room_roomBasicInfo',
  default: null,
});

// roomId => meeting room locked
export const roomLockedFamily = atomFamily<boolean, string>({
  key: 'room_roomLocked',
  default: false,
});

// 当前所有空间
export const roomIdsState = atom<string[]>({
  key: 'room_roomIds',
  default: [],
});

export interface RoomData extends RoomBasicInfo {
  locked?: boolean;
}

// roomId => RoomData
export const roomDataFamily = selectorFamily<RoomData, string>({
  key: 'room_roomData',
  get:
    (roomId) =>
    ({ get }) => {
      const basicInfo = get(roomBasicInfoFamily(roomId));
      const locked = get(roomLockedFamily(roomId));
      return {
        ...basicInfo,
        locked,
      };
    },
  set:
    (roomId) =>
    ({ set }, data: RoomData) => {
      const { locked, ...basicInfo } = data;
      set(roomBasicInfoFamily(roomId), basicInfo);
      set(roomLockedFamily(roomId), locked);
    },
});

export const roomDataListState = selector<RoomData[]>({
  key: 'room_roomDataList',
  get: ({ get }) => {
    const roomIds = get(roomIdsState);
    const roomDataList = roomIds.map((roomId): RoomData => {
      const basicInfo = get(roomBasicInfoFamily(roomId));
      if (!basicInfo) {
        throw new Error(`missing room: ${roomId}`);
      }
      const locked = get(roomLockedFamily(roomId));
      return {
        ...basicInfo,
        locked,
      };
    });
    return roomDataList;
  },
  set: ({ set }, roomDataList: RoomData[]) => {
    set(
      roomIdsState,
      roomDataList.map((room) => room.id),
    );
    roomDataList.forEach((data) => {
      const { id, type, avatar, title, locked } = data;
      set(roomBasicInfoFamily(id), { id, type, avatar, title });
      set(roomLockedFamily(id), locked);
    });
  },
});

/**
 * 当前房间所有用户
 *   roomId => userId[]
 */
export const roomUserIdsFamily = atomFamily<string[], string>({
  key: 'roomSpace_roomUserIds',
  default: [],
});
