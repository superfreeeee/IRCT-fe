import classNames from 'classnames';
import styled, { StyledComponent } from 'styled-components';

import { AvatarUsage } from './type';

interface AvatarProps {
  usage?: AvatarUsage;
  default?: boolean;
}

const Avatar: StyledComponent<
  'div',
  any,
  AvatarProps
> = styled.div.attrs<AvatarProps>((props) => ({
  className: classNames(props.usage, { noAvatar: props.default }),
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 2px solid #fff;
  border-radius: 50%;

  &.noAvatar {
    background-color: var(--avatar_default_bg);
    font-size: 18px;
  }

  &.${AvatarUsage.IMUserInfo} {
    width: 55px;
    height: 55px;
  }

  &.${AvatarUsage.IMMenuItem} {
    min-width: 27px;
    width: 27px;
    height: 27px;
    border: 0;
  }

  &.${AvatarUsage.RoomSpaceHeader} {
    width: 50px;
    height: 50px;
    border: 0;
    font-size: 26px;
  }

  &.${AvatarUsage.RoomSpaceChat} {
    width: 33px;
    height: 33px;
    color: #fff;
  }

  &.${AvatarUsage.RoomSpaceRoom} {
    width: 41px;
    height: 41px;
  }

  &.${AvatarUsage.MeetingCall} {
    width: 73px;
    height: 73px;
  }
`;

export default Avatar;
