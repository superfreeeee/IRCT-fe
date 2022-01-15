import {
  SpaceFigure,
  SpaceFigurePosition,
  SpaceFigureWithVideo,
  VideoVoiceRate,
} from '@store/reducers/space';
import { SIMULATION_BOARD_HEIGHT, SIMULATION_BOARD_WIDTH } from './styles';
import {
  FIGURE_DISTANCE_LEVEL1,
  FIGURE_DISTANCE_LEVEL2,
  FIGURE_DISTANCE_LEVEL3,
  SIMULATION_FIGURE_SIZE,
  SIMULATION_FIGURE_SIZE_INNER,
} from './config';

/**
 * 计算初入房间位置
 * @param width
 * @param height
 * @returns
 */
export const calcInitPosition = (
  figures: SpaceFigure[],
  width: number = SIMULATION_BOARD_WIDTH,
  height: number = SIMULATION_BOARD_HEIGHT,
  followee?: string,
): SpaceFigurePosition => {
  if (followee) {
    const followingFigure = figures.filter(
      (figure) => figure.userId === followee,
    )[0];
    if (followingFigure) {
      const [x0, y0] = followingFigure.position;
      const offset = SIMULATION_FIGURE_SIZE + SIMULATION_FIGURE_SIZE_INNER / 2;
      let [x, y] = [x0 + offset, y0 + offset];
      x >= width && (x = x0 - offset);
      y >= height && (y = y0 - offset);
      return [x, y];
    }
  }
  return [width / 2, height / 2];
};

/**
 * 获取临近附近人物
 * @param currentFigure
 * @param figures
 * @returns
 */
export const calcNearbyFigures = (
  currentFigure: SpaceFigure,
  figures: SpaceFigure[],
): SpaceFigureWithVideo[] => {
  if (figures.length <= 1) {
    return [];
  }

  const nearbyFigures: SpaceFigureWithVideo[] = figures
    .map((figure) => {
      // 1. calc distance
      const _d = calcDistance(currentFigure, figure);
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

  return nearbyFigures;
};

/**
 * 计算 dx^2 + dy^2
 * @param f1
 * @param f2
 * @returns
 */
const calcDistance = (f1: SpaceFigure, f2: SpaceFigure) => {
  const [x0, y0] = f1.position;
  const [x1, y1] = f2.position;

  const [dx, dy] = [x1 - x0, y1 - y0];

  return dx * dx + dy * dy;
};

export const resetActiveStates = (figures: SpaceFigure[]): SpaceFigure[] => {
  const len = figures.length;

  // new copy
  figures = figures.map((figure) => ({ ...figure, active: false }));
  for (let i = 0; i < len; i++) {
    const target = figures[i];
    for (let j = i + 1; j < len; j++) {
      const other = figures[j];
      if (calcDistance(target, other) <= FIGURE_DISTANCE_LEVEL3) {
        target.active = other.active = true;
      }
    }
  }

  return figures;
};
