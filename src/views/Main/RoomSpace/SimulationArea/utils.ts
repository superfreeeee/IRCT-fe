import { VideoRoomFigure, VideoVoiceRate } from '@views/Main/state/type';
import { SpaceFigure } from '@store/reducers/space';
import { SIMULATION_BOARD_HEIGHT, SIMULATION_BOARD_WIDTH } from './styles';
import {
  FIGURE_DISTANCE_LEVEL1,
  FIGURE_DISTANCE_LEVEL2,
  FIGURE_DISTANCE_LEVEL3,
  SIMULATION_FIGURE_SIZE,
  SIMULATION_FIGURE_SIZE_INNER,
} from './config';
import {
  RoomSpacePosition,
  UserRoomSpaceFigure,
  UserRoomSpaceInfo,
} from '@views/Main/state/type';

/**
 * 计算初入房间位置
 */
export const calcInitPosition = (
  followeePosition?: RoomSpacePosition,
): RoomSpacePosition => {
  if (followeePosition) {
    console.log(`following`, followeePosition);
    // 如果跟随某人
    const [x0, y0] = followeePosition;
    const offset = SIMULATION_FIGURE_SIZE + SIMULATION_FIGURE_SIZE_INNER / 2;
    let [x, y] = [x0 + offset, y0 + offset];
    x >= SIMULATION_BOARD_WIDTH && (x = x0 - offset);
    y >= SIMULATION_BOARD_HEIGHT && (y = y0 - offset);
    return [x, y];
  }
  return [SIMULATION_BOARD_WIDTH / 2, SIMULATION_BOARD_HEIGHT / 2];
};

/**
 * 获取临近附近人物
 * @param currentFigure
 * @param figures
 * @returns
 */
export const calcNearbyFigures = (
  currentFigure: UserRoomSpaceFigure,
  figures: UserRoomSpaceFigure[],
): VideoRoomFigure[] => {
  if (figures.length <= 1) {
    return [];
  }

  const nearbyFigures = figures
    .map((figure): VideoRoomFigure => {
      // 1. calc distance
      const _d = distanceBetween(currentFigure.position, figure.position);

      // 2. calc voice rate base on distance
      let voiceRate: VideoVoiceRate;
      if (_d <= FIGURE_DISTANCE_LEVEL1) {
        voiceRate = VideoVoiceRate.LEVEL1;
      } else if (_d <= FIGURE_DISTANCE_LEVEL2) {
        voiceRate = VideoVoiceRate.LEVEL2;
      } else if (_d <= FIGURE_DISTANCE_LEVEL3) {
        voiceRate = VideoVoiceRate.LEVEL3;
      } else {
        voiceRate = VideoVoiceRate.LEVEL4;
      }
      return {
        ...figure,
        voiceRate,
      };
    })
    // 3. filter by voice rate
    .filter((figure) => figure.voiceRate > 0); // 不用过滤自己

  // 只有自己就算了
  if (nearbyFigures.length === 1) {
    return [];
  }

  return nearbyFigures.sort((f1, f2) => f2.voiceRate - f1.voiceRate);
};

/**
 * 计算 dx^2 + dy^2
 */
export const distanceBetween = (
  p1: RoomSpacePosition,
  p2: RoomSpacePosition,
): number => {
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  const [dx, dy] = [x2 - x1, y2 - y1];
  return dx * dx + dy * dy;
};

/**
 * 重新计算房间内对话状态(isTalking 状态)
 */
export const resetTalkingState = (users: UserRoomSpaceInfo[]) => {
  const len = users.length;

  // new copy
  const newUsers = users.map((user) => ({ ...user, isTalking: false }));
  for (let i = 0; i < len; i++) {
    const target = newUsers[i];
    for (let j = i + 1; j < len; j++) {
      const other = newUsers[j];
      if (
        distanceBetween(target.position, other.position) <=
        FIGURE_DISTANCE_LEVEL3
      ) {
        target.isTalking = other.isTalking = true;
      }
    }
  }

  return newUsers;
};
