import React, { useEffect, useRef } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import useClickDetect from '@hooks/useClickDetect';
import {
  activeAppState,
  AppSidebarType,
  appSidebarVisibleState,
} from '../state/appSidebar';
import { expandVideoRoomState } from '../state/roomSpace';
import { AppSidebarContainer } from './styles';

const AppSidebar = () => {
  const setExpandVideoRoom = useSetRecoilState(expandVideoRoomState);
  const [appSidebarVisible, setAppSidebarVisible] = useRecoilState(
    appSidebarVisibleState,
  );

  const [activeApp, setActiveApp] = useRecoilState(activeAppState);

  const containerRef = useRef<HTMLDivElement>(null);

  useClickDetect(
    containerRef,
    (isOutside) => {
      if (isOutside) {
        setAppSidebarVisible(false);
        setActiveApp(AppSidebarType.None);
        setExpandVideoRoom(true);
      }
    },
    // active when visible
    appSidebarVisible,
  );

  return (
    <AppSidebarContainer
      ref={containerRef}
      className={classNames({ isVisible: appSidebarVisible })}
    >
      {activeApp}
    </AppSidebarContainer>
  );
};

export default AppSidebar;
