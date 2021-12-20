import { SpaceFigurePosition } from '@store/reducers/space';
import { SIMULATION_BOARD_HEIGHT, SIMULATION_BOARD_WIDTH } from './styles';

export const calcInitPosition = (
  width: number = SIMULATION_BOARD_WIDTH,
  height: number = SIMULATION_BOARD_HEIGHT
): SpaceFigurePosition => {
  return [width / 2, height / 2];
};
