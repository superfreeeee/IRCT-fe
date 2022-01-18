import { atom, atomFamily, selector, selectorFamily } from 'recoil';
import { resetTalkingState } from '../RoomSpace/SimulationArea/utils';
import { roomSpaceUserFigureListFamily } from './roomSpace';
import { RoomType } from './type';
import {
  userCurrentRoomIdFamily,
  userTalkingListState,
  userTalkingStateFamily,
} from './user';

export interface RoomBasicInfo {
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

export const roomIdsBaseState = atom({
  key: 'room_roomIdsBase',
  default: [],
});

/**
 * get: 获取当前所有空间 Id
 * set: 移除/添加房间
 *   移除房间：修改 user 状态
 */
export const roomIdsState = selector<string[]>({
  key: 'room_roomIds',
  get: ({ get }) => get(roomIdsBaseState),
  set: ({ set, get }, roomIds: string[]) => {
    set(roomIdsBaseState, roomIds);

    // removed rooms
    const originRoomIds = get(roomIdsBaseState);
    const removedRoomIds = originRoomIds.filter(
      (roomId) => !roomIds.includes(roomId),
    );
    removedRoomIds.forEach((roomId) => {
      const userIds = get(roomUserIdsFamily(roomId));
      userIds.forEach((userId) => {
        set(userCurrentRoomIdFamily(userId), '');
      });
    });
  },
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
export const roomUserIdsBaseFamily = atomFamily<string[], string>({
  key: 'roomSpace_roomUserIdsBase',
  default: [],
});

/**
 * 更新房间用户信息
 */
export const roomUserIdsFamily = selectorFamily<string[], string>({
  key: 'roomSpace_roomUserIds',
  get:
    (roomId) =>
    ({ get }) =>
      get(roomUserIdsBaseFamily(roomId)),
  set:
    (roomId) =>
    ({ set, get }, userIds: string[]) => {
      // userIds.
      const originUserIds = get(roomUserIdsBaseFamily(roomId));
      const removedUserIds = originUserIds.filter(
        (userId) => !userIds.includes(userId),
      );

      // 离开房间的 isTalking = false
      removedUserIds.forEach((userId) => {
        set(userTalkingStateFamily(userId), false);
      });

      // 剩余角色重新计算 talking
      const figures = get(roomSpaceUserFigureListFamily(roomId));
      const restFigures = figures.filter((figure) =>
        userIds.includes(figure.id),
      );

      const userUpdates = resetTalkingState(restFigures).map(
        ({ id, isTalking }) => ({
          userId: id,
          isTalking,
        }),
      );
      set(userTalkingListState, userUpdates);

      // 更新房间人员信息
      set(roomUserIdsBaseFamily(roomId), userIds);
    },
});
