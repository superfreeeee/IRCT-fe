import styled from 'styled-components';

import Avatar from '@components/Avatar';
import EmojiIcon from '@components/EmojiIcon';
import { RoomSpaceContainer } from '../styles';
import { RoomSpaceType } from '../type';

export const RoomSpaceHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 14px 30px 14px 14px;
  border-bottom: 1px solid var(--divider_color_bg);
  color: #fff;
`;

export const HeaderMain = styled.div`
  flex-shrink: 0;
  flex-grow: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${Avatar} {
    width: 42px;
    height: 42px;
    margin-right: 15px;
  }

  /* ${EmojiIcon} {
    margin-right: 12px;
  } */
`;

export const HeaderSide = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;
