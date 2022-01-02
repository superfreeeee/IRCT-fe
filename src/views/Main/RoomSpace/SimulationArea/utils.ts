import { SpaceFigure, SpaceFigurePosition } from '@store/reducers/space';
import { SIMULATION_BOARD_HEIGHT, SIMULATION_BOARD_WIDTH } from './styles';

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
 * 获取距离最近的其他任务
 * @param currentFigure
 * @param figures
 * @returns
 */
export const calcClosestFigure = (
  currentFigure: SpaceFigure,
  figures: SpaceFigure[]
) => {
  if (figures.length <= 1) {
    return null;
  }

  let closestFigure =
    figures[0].userId === currentFigure.userId ? figures[1] : figures[0];
  let closestDistance = calcDistance(currentFigure, closestFigure);

  figures
    .filter((figure) => figure.userId !== currentFigure.userId)
    .forEach((figure) => {
      const distance = calcDistance(currentFigure, figure);
      if (distance < closestDistance) {
        closestFigure = figure;
        closestDistance = distance;
      }
    });
  console.log(`[calcClosestFigure] closestFigure`, closestFigure);
  console.log(`[calcClosestFigure] closestDistance`, closestDistance);

  return closestFigure;
};

const calcDistance = (f1: SpaceFigure, f2: SpaceFigure) => {
  const [x0, y0] = f1.position;
  const [x1, y1] = f2.position;

  const [dx, dy] = [x1 - x0, y1 - y0];

  return dx * dx + dy * dy;
};
