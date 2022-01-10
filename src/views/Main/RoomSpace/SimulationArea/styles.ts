import styled from 'styled-components';
import {
  SIMULATION_FIGURE_SIZE_INNER,
  SIMULATION_FIGURE_SIZE_OUTER,
} from './config';

export const SIMULATION_BOARD_WIDTH = 500;
export const SIMULATION_BOARD_HEIGHT = 500;
export const SIMULATION_BOARD_PADDING = 25;

export const SimulationBoard = styled.div`
  position: absolute;
  width: ${SIMULATION_BOARD_WIDTH}px;
  height: ${SIMULATION_BOARD_HEIGHT}px;

  &.shrink {
    width: 100%;
    height: 100%;
  }
`;

export const FigureContainer = styled.div`
  position: absolute;
  left: ${SIMULATION_BOARD_PADDING}px;
  top: ${SIMULATION_BOARD_PADDING}px;
  border-radius: 50%;
  box-shadow: 0 0 0 ${SIMULATION_FIGURE_SIZE_INNER}px
      var(--room_space_figure_radius_level1),
    0 0 0 ${SIMULATION_FIGURE_SIZE_INNER + SIMULATION_FIGURE_SIZE_OUTER}px
      var(--room_space_figure_radius_level2);
  transform: translate(-50%, -50%);
  user-select: none;

  &.noShadow {
    box-shadow: none;
  }
`;

export const MicroOffWrapper = styled.div`
  position: absolute;
  left: -2px;
  bottom: -2px;
  padding: 2px;
  border-radius: 50%;
  color: #fff;
  background-color: #666666;
`;
