import styled from 'styled-components';

export const SIMULATION_BOARD_WIDTH = 1000;
export const SIMULATION_BOARD_HEIGHT = 1000;
export const SIMULATION_BOARD_PADDING = 25;

export const SimulationBoard = styled.div`
  position: relative;
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
  transform: translate(-50%, -50%);
  user-select: none;
`;
