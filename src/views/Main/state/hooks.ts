import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { calcInitPosition } from '../RoomSpace/SimulationArea/utils';
import {
  currentTabState,
  selectedRoomIdState,
  selectedRoomTypeState,
} from './im';
import { roomBasicInfoFamily, roomIdsState, roomUserIdsFamily } from './room';
import { currentSpaceIdState } from './roomSpace';
import { RoomType, TabOption, ViewPointRecord } from './type';
import {
  currentUserIdState,
  userCurrentRoomIdFamily,
  userRoomSpacePositionFamily,
} from './user';

import meetingTempAvatar from '@assets/img/meeting_temp.png';
import { PlainFn } from '@utils/type';
import {
  viewPointCenterUserIdState,
  viewPointStackState,
  viewPointTypeState,
} from './okrPath';
import { ViewPointType } from './okrDB/type';

// ========== room 相关 ==========
/**
 * 加入新房间
 */
export const useEnterRoom = (newRoomId: string, followeeId: string) => {
  // 当前用户状态
  const userId = useRecoilValue(currentUserIdState);
  const currentRoomId = useRecoilValue(userCurrentRoomIdFamily(userId));
  const currentRoomType = useRecoilValue(selectedRoomTypeState);

  const isNewRoom = currentRoomId !== newRoomId;

  // 当前所有房间信息
  const [roomIds, setRoomIds] = useRecoilState(roomIdsState);

  // 房间用户信息
  const [oldRoomUserIds, setOldRoomUserIds] = useRecoilState(
    roomUserIdsFamily(currentRoomId),
  );
  const [newRoomUserIds, setNewRoomUserIds] = useRecoilState(
    roomUserIdsFamily(newRoomId),
  );

  const setSelectedRoomId = useSetRecoilState(selectedRoomIdState);
  const setMyCurrentRoomId = useSetRecoilState(userCurrentRoomIdFamily(userId));
  const setMyPosition = useSetRecoilState(userRoomSpacePositionFamily(userId));

  // 跟随目标信息
  const followeePosition = useRecoilValue(
    userRoomSpacePositionFamily(followeeId),
  );

  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);

  const enterRoom = useCallback(
    (following?: boolean) => {
      if (isNewRoom) {
        // 离开旧房间
        const oldUserIds = oldRoomUserIds.filter((id) => id !== userId);
        setOldRoomUserIds(oldUserIds);

        if (
          currentRoomType === RoomType.TempMeeting &&
          oldUserIds.length <= 1
        ) {
          // 删除空临时会议
          setRoomIds(roomIds.filter((roomId) => roomId !== currentRoomId));
        }

        // 加入新房间
        setNewRoomUserIds([...newRoomUserIds, userId]);
      }

      // 更新当前用户状态
      setSelectedRoomId(newRoomId);
      setMyCurrentRoomId(newRoomId);

      // 根据跟随目标更新起始位置
      const newPosition = calcInitPosition(following && followeePosition);
      setMyPosition(newPosition);

      // 更新 roomSpaceId
      setCurrentSpaceId(newRoomId);

      // console.group(`[useEnterRoom] enterRoom`);
      // console.log(`following = ${following && followeeId}`);
      // console.log(`currentRoomId = ${currentRoomId}`);
      // console.log(`newRoomId = ${newRoomId}`);
      // console.log(`followeePosition = ${followeePosition}`);
      // console.log(`newPosition = ${newPosition}`);
      // console.groupEnd();
    },
    [
      isNewRoom,
      currentRoomId,
      currentRoomType,
      userId,
      oldRoomUserIds,
      setOldRoomUserIds,
      newRoomUserIds,
      setNewRoomUserIds,
      newRoomId,
      setMyCurrentRoomId,
      setMyPosition,
      followeePosition,
    ],
  );

  return enterRoom;
};

/**
 * 离开房间
 */
export const useExitRoom = () => {
  const userId = useRecoilValue(currentUserIdState);
  const currentRoomId = useRecoilValue(userCurrentRoomIdFamily(userId));

  // 房间用户信息
  const [currentRoomUserIds, setCurrentRoomUserIds] = useRecoilState(
    roomUserIdsFamily(currentRoomId),
  );

  const selectedRoomType = useRecoilValue(selectedRoomTypeState);

  const [selectedRoomId, setSelectedRoomId] =
    useRecoilState(selectedRoomIdState);
  const setMyCurrentRoomId = useSetRecoilState(userCurrentRoomIdFamily(userId));
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);

  const [roomIds, setRoomIds] = useRecoilState(roomIdsState);

  const exitRoom = useCallback(() => {
    // 离开当前房间
    const oldUserIds = currentRoomUserIds.filter((id) => id !== userId);
    setCurrentRoomUserIds(oldUserIds);

    // 删除空临时会议
    if (selectedRoomType === RoomType.TempMeeting && oldUserIds.length <= 1) {
      setRoomIds(roomIds.filter((roomId) => roomId !== selectedRoomId));
    }

    // 更新当前用户状态
    setSelectedRoomId('');
    setMyCurrentRoomId('');

    // 更新 roomSpaceId
    setCurrentSpaceId('');
  }, [
    userId,
    selectedRoomId,
    selectedRoomType,
    currentRoomUserIds,
    setCurrentRoomUserIds,
    setMyCurrentRoomId,
  ]);

  return exitRoom;
};

// ========== meeting 相关 ==========
/**
 * 创建临时房间
 */
let _tempMeetingIdSeed = 100;
const getNextMeetingId = () => `room-tmp_${_tempMeetingIdSeed}`;
export const useCreateTempMeeting = (targetUserId: string) => {
  const userId = useRecoilValue(currentUserIdState);

  const [roomIds, setRoomIds] = useRecoilState(roomIdsState);

  const setCurrentTab = useSetRecoilState(currentTabState);

  // 用户 currentRoomId
  const [myCurrentRoomId, setMyCurrentRoomId] = useRecoilState(
    userCurrentRoomIdFamily(userId),
  );
  const [targetCurrentRoomId, setTargetCurrentRoomId] = useRecoilState(
    userCurrentRoomIdFamily(targetUserId),
  );

  // 用户所在房间 userIds
  const [myRoomUserIds, setMyRoomUserIds] = useRecoilState(
    roomUserIdsFamily(myCurrentRoomId),
  );
  const [targetRoomUserIds, setTargetRoomUserIds] = useRecoilState(
    roomUserIdsFamily(targetCurrentRoomId),
  );

  // 全局选中房间状态 selectedRoomId, currentSpaceId
  const setSelectedRoomId = useSetRecoilState(selectedRoomIdState);
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);

  // 新房间状态
  const nextMeetingId = getNextMeetingId();
  const setRoomBasicInfo = useSetRecoilState(
    roomBasicInfoFamily(nextMeetingId),
  );
  const setNewRoomUserIds = useSetRecoilState(roomUserIdsFamily(nextMeetingId));

  /**
   * 创建临时会议室
   */
  const createTempMeeting = () => {
    // 创建新房间
    setRoomBasicInfo({
      id: nextMeetingId,
      type: RoomType.TempMeeting,
      avatar: meetingTempAvatar,
      title: 'Temporary meeting rooms',
    });
    setRoomIds([nextMeetingId, ...roomIds]);
    _tempMeetingIdSeed += 1;

    // 退出旧房间
    setMyCurrentRoomId(nextMeetingId);
    setTargetCurrentRoomId(nextMeetingId);
    if (myCurrentRoomId === targetCurrentRoomId) {
      setMyRoomUserIds(
        myRoomUserIds.filter((id) => id !== userId && id !== targetUserId),
      );
    } else {
      setMyRoomUserIds(myRoomUserIds.filter((id) => id !== userId));
      setTargetRoomUserIds(
        targetRoomUserIds.filter((id) => id !== targetUserId),
      );
    }

    // 加入新房间
    setNewRoomUserIds([userId, targetUserId]);

    setCurrentTab(TabOption.Room);
    setSelectedRoomId(nextMeetingId);
    setCurrentSpaceId(nextMeetingId);
  };

  return createTempMeeting;
};

export const useInviteToRoom = (roomId: string, targetUserId: string) => {
  const [currentRoomId, setCurrentRoomId] = useRecoilState(
    userCurrentRoomIdFamily(targetUserId),
  );

  const [currentRoomUserIds, setCurrentRoomUserIds] = useRecoilState(
    roomUserIdsFamily(currentRoomId),
  );
  const [roomUserIds, setRoomUserIds] = useRecoilState(
    roomUserIdsFamily(roomId),
  );

  const inviteToRoom = () => {
    setCurrentRoomId(roomId);
    setCurrentRoomUserIds(
      currentRoomUserIds.filter((userId) => userId !== targetUserId),
    );
    setRoomUserIds([...roomUserIds, targetUserId]);
  };

  return inviteToRoom;
};
