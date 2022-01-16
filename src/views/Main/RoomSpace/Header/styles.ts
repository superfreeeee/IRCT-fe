import styled from 'styled-components';

import Avatar from '@components/Avatar';
import { ROOM_SPACE_WIDTH, ROOM_SPACE_WIDTH_WIDE } from '../styles';
import StatusPoint from '@components/StatusPoint';
import { AppIconWrapper } from '@components/AppIcon';

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
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    margin-right: 15px;
  }

  .content {
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title {
    font-size: 16px;
  }

  .subtitle {
    display: flex;
    align-items: center;
    font-size: 12px;

    ${StatusPoint} {
      margin-right: 9px;
    }

    ${AppIconWrapper} {
      position: relative;
      margin: 0 5px 3px 3px;
    }
  }
`;

export const HeaderSide = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderSideBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: #474849;
  }
`;
