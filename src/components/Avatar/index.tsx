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
  border-radius: 50%;

  overflow: hidden;
  object-fit: fill;

  &.noAvatar {
    background-color: var(--avatar_default_bg);
    font-size: 18px;
  }

  &.${AvatarUsage.RoomSpaceChat} {
    width: 33px;
    height: 33px;
    color: #fff;
  }

  &.${AvatarUsage.MeetingCall} {
    width: 73px;
    height: 73px;
  }
`;

export default Avatar;
