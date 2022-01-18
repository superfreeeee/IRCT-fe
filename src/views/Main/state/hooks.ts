import { useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { calcInitPosition } from '../RoomSpace/SimulationArea/utils';
import { selectedRoomIdState } from './im';
import { roomUserIdsFamily } from './room';
import { currentSpaceIdState } from './roomSpace';
import {
  currentUserIdState,
  userCurrentRoomIdFamily,
  userRoomSpacePositionFamily,
} from './user';

/**
 * 加入新房间
 */
export const useEnterRoom = (newRoomId: string, followeeId: string) => {
  // 当前用户状态
  const userId = useRecoilValue(currentUserIdState);
  const currentRoomId = useRecoilValue(userCurrentRoomIdFamily(userId));

  const isNewRoom = currentRoomId !== newRoomId;

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

  const setSelectedRoomId = useSetRecoilState(selectedRoomIdState);
  const setMyCurrentRoomId = useSetRecoilState(userCurrentRoomIdFamily(userId));
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);

  const exitRoom = useCallback(() => {
    // 离开当前房间
    const oldUserIds = currentRoomUserIds.filter((id) => id !== userId);
    setCurrentRoomUserIds(oldUserIds);

    // 更新当前用户状态
    setSelectedRoomId('');
    setMyCurrentRoomId('');

    // 更新 roomSpaceId
    setCurrentSpaceId('');
  }, [userId, currentRoomUserIds, setCurrentRoomUserIds, setMyCurrentRoomId]);

  return exitRoom;
};
