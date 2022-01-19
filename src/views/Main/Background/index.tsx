import classNames from 'classnames';
import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { appSidebarVisibleBaseState } from '../state/appSidebar';
import { expandVideoRoomState } from '../state/roomSpace';

const BackgroundContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;

  &.hide {
    display: none;
  }
`;

const Background = () => {
  const expandVideoRoom = useRecoilValue(expandVideoRoomState);
  const appSidebarVisible = useRecoilValue(appSidebarVisibleBaseState);

  const hide = expandVideoRoom || appSidebarVisible;

  return (
    <BackgroundContainer className={classNames({ hide })}>
      bg
    </BackgroundContainer>
  );
};

export default Background;
