import styled from 'styled-components';

import Avatar from '@components/Avatar';
import { ROOM_SPACE_WIDTH, ROOM_SPACE_WIDTH_WIDE } from '../styles';

export const RoomSpaceHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: ${ROOM_SPACE_WIDTH_WIDE}px;
  padding: 14px 22px 14px 14px;
  border-bottom: 1px solid var(--divider_color_bg);
  color: #fff;
  overflow: hidden;

  &.isRoom {
    width: ${ROOM_SPACE_WIDTH}px;
  }

  &.isRoom.expand {
    width: 100%;
  }
`;

export const HeaderMain = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${Avatar} {
    min-width: 42px;
    height: 42px;
    margin-right: 15px;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const HeaderSide = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderSideBtn = styled.div`
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: #474849;
  }
`;
