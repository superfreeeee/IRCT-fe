import Avatar from '@components/Avatar';
import styled from 'styled-components';

import { RoomSpaceContainer, ROOM_SPACE_HEADER_PADDING } from '../styles';
import { RoomSpaceType } from '../type';

export const RoomSpaceHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: ${ROOM_SPACE_HEADER_PADDING}px;
  color: #fff;
`;

export const HeaderMain = styled.div`
  display: flex;
  align-items: center;

  ${Avatar} {
    margin-right: 15px;
  }

  ${RoomSpaceContainer}.${RoomSpaceType.Room} & {
    flex: 1;
    justify-content: center;
  }
`;

export const HeaderSide = styled.div`
  display: flex;
  align-items: center;

  ${RoomSpaceContainer}.${RoomSpaceType.Room} & {
    position: absolute;
    right: ${ROOM_SPACE_HEADER_PADDING}px;
  }
`;
