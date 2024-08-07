import Avatar from '@/components/Avatar';
import styled from 'styled-components';

import { ChatContainer } from '../Chat/styles';

export const DEFAULT_SIMULATION_AREA_HEIGHT = 300;
export const MIN_SIMULATION_AREA_HEIGHT = 250;
export const MAX_SIMULATION_AREA_HEIGHT = 400;
const MEETING_ROOM_HEIGHT = 230;

export const RoomContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  ${ChatContainer} {
    flex: 1;
  }
`;

export const RoomDescription = styled.p`
  flex-shrink: 0;
  padding: 12px 16px;
  height: 100px;
  font-size: 12px;
  color: #fff;
  overflow: auto;
`;

/**
 * 会议类型房间
 */
export const MeetingRoomMembersWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
  height: ${MEETING_ROOM_HEIGHT}px;
  margin: 12px 15px 0;
  overflow: auto;

  ${Avatar} {
    width: 38px;
    height: 38px;
  }
`;

export const MeetingRoomAddBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: #fff;
  background-color: #474849;
  user-select: none;
`;

/**
 * 仿真空间
 */
export const SimulationAreaWrapper = styled.div`
  flex-shrink: 0;
  position: relative;
  height: ${DEFAULT_SIMULATION_AREA_HEIGHT}px;
  margin: 12px 24px 0;
  border-radius: 10px;
  background-color: var(--room_space_area_bg);
  overflow: hidden;
`;
