import styled from 'styled-components';

import { VIDEO_ROOM_WIDTH } from '../styles';

export const VideoRoomContainer = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  max-width: ${VIDEO_ROOM_WIDTH}px;
  max-height: 100%;
  padding: 78px 25px 0 30px;
  z-index: 1;
  overflow: auto;
`;
