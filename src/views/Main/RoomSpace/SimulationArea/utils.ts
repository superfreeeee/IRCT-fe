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
  height: number = SIMULATION_BOARD_HEIGHT
): SpaceFigurePosition => {
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
  figures: SpaceFigure[]
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
    .filter(
      (figure) => figure.voiceRate > 0 && figure.userId !== currentFigure.userId
    );

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
