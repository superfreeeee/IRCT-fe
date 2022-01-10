import styled from 'styled-components';

import { ChatContainer } from '../Chat/styles';

export const DEFAULT_SIMULATION_AREA_HEIGHT = 300;
export const MIN_SIMULATION_AREA_HEIGHT = 250;
export const MAX_SIMULATION_AREA_HEIGHT = 400;

export const RoomContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${ChatContainer} {
    flex: 1;
  }
`;

export const RoomDescription = styled.p`
  margin: 15px 35px 15px 40px; // 40 px total
  font-size: 14px;
  color: #fff;
`;

export const SimulationAreaWrapper = styled.div`
  position: relative;
  margin: 12px 24px 0;
  border-radius: 10px;
  background-color: var(--room_space_area_bg);
  overflow: hidden;
`;
