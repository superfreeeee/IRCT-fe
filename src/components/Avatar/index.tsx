import styled, { StyledComponent } from 'styled-components';

import { AvatarUsage } from './type';

interface AvatarProps {
  usage?: AvatarUsage;
}

const Avatar: StyledComponent<
  'div',
  any,
  AvatarProps
> = styled.div.attrs<AvatarProps>((props) => ({
  className: props.usage,
}))`
  width: 50px;
  height: 50px;
  border: 2px solid #fff;
  border-radius: 50%;

  &.${AvatarUsage.IMUserInfo} {
    width: 55px;
    height: 55px;
  }

  &.${AvatarUsage.IMMenuItem} {
    min-width: 27px;
    width: 27px;
    height: 27px;
  }

  &.${AvatarUsage.RoomSpaceHeader} {
    width: 50px;
    height: 50px;
  }

  &.${AvatarUsage.RoomSpaceChat} {
    width: 30px;
    height: 30px;
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
