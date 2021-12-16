import Avatar from '@components/Avatar';
import EmojiIcon from '@components/EmojiIcon';
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
    padding: 0 40px 0 15px;
    overflow: hidden;

    & .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  ${EmojiIcon} {
    margin-right: 12px;
  }
`;

export const HeaderSide = styled.div`
  display: flex;
  align-items: center;

  ${RoomSpaceContainer}.${RoomSpaceType.Room} & {
    position: absolute;
    top: ${ROOM_SPACE_HEADER_PADDING + 6}px;
    right: ${ROOM_SPACE_HEADER_PADDING}px;
  }
`;
