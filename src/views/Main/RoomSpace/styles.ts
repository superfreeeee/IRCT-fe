import Avatar from '@components/Avatar';
import styled from 'styled-components';

import { ROOM_SPACE_WIDTH_CHAT, ROOM_SPACE_WIDTH_ROOM } from '../styles';
import { RoomSpaceType } from './type';

const ROOM_SPACE_LEFT_PADDING = 60;
const ROOM_SPACE_HEADER_PADDING = 18;

export const RoomSpaceContainer = styled.div`
  height: 100%;
  z-index: 10;

  &.hidden {
    display: none;
  }

  &.${RoomSpaceType.Room} {
    width: ${ROOM_SPACE_WIDTH_ROOM}px;
  }

  &.${RoomSpaceType.Chat} {
    width: ${ROOM_SPACE_WIDTH_CHAT}px;
  }
`;

// wrapper 向左偏移填满圆角边缘颜色
export const RoomSpaceWrapper = styled.div`
  width: calc(100% + ${ROOM_SPACE_LEFT_PADDING}px);
  padding-left: ${ROOM_SPACE_LEFT_PADDING}px;
  height: 100%;
  border-radius: 30px;
  background-color: var(--room_space_bg);
  transform: translateX(-${ROOM_SPACE_LEFT_PADDING}px);
`;

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

export const Divider = styled.div`
  margin: 0 25px 0 15px;
  border-bottom: 1px solid #fff;
`;
