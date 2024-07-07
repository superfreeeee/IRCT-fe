import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import classNames from 'classnames';

import {
  currentSpaceTypeState,
  expandVideoRoomState,
  roomSpaceVisibleState,
} from '../state/roomSpace';
import { okrPathVisibleState } from '../state/okrPath';
import { TabOption } from '../state/type';
import { appSidebarVisibleState } from '../state/appSidebar';

import backgroundLogoUrl from '@/assets/img/background_logo.png';

const BackgroundContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  height: 100%;
  padding-top: 5%;

  opacity: 15%;

  &.hide {
    display: none;
  }

  .logo {
    min-width: 150px;
  }

  .text {
    max-width: 50%;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
`;

const Background = () => {
  const roomSpaceVisible = useRecoilValue(roomSpaceVisibleState);
  const expandVideoRoom = useRecoilValue(expandVideoRoomState);
  const currentSpaceType = useRecoilValue(currentSpaceTypeState);
  const isRoom = currentSpaceType === TabOption.Room;

  const appSidebarVisible = useRecoilValue(appSidebarVisibleState);

  const okrVisible = useRecoilValue(okrPathVisibleState);

  const hide =
    (roomSpaceVisible && ((isRoom && expandVideoRoom) || appSidebarVisible)) ||
    okrVisible;

  const text = 'Welecome San, you can start a conversation or join a room';

  return (
    <BackgroundContainer className={classNames({ hide })}>
      <img src={backgroundLogoUrl} width={'20%'} className="logo" />
      <div className="text">{text}</div>
    </BackgroundContainer>
  );
};

export default Background;
