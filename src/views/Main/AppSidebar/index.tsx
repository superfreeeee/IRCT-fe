import React, { useEffect, useRef } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import {
  activeAppState,
  AppSidebarType,
  appSidebarVisibleState,
} from '../state/appSidebar';
import { expandVideoRoomState } from '../state/roomSpace';
import { AppSidebarContainer } from './styles';
import useClosestRef from '@hooks/useClosestRef';

const AppSidebar = () => {
  const setExpandVideoRoom = useSetRecoilState(expandVideoRoomState);
  const [appSidebarVisible, setAppSidebarVisible] = useRecoilState(
    appSidebarVisibleState,
  );

  const [activeApp, setActiveApp] = useRecoilState(activeAppState);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appSidebarVisible) {
      const onDocumentClick = (e: MouseEvent) => {
        let isOutsideSidebar = true;
        let el = e.target as Node;
        while (el && el !== document.body) {
          if (el === containerRef.current) {
            isOutsideSidebar = false;
            break;
          }
          el = el.parentNode;
        }

        if (isOutsideSidebar) {
          setAppSidebarVisible(false);
          setActiveApp(AppSidebarType.None);
          setExpandVideoRoom(true);
        }
      };

      document.addEventListener('click', onDocumentClick);
      return () => {
        document.removeEventListener('click', onDocumentClick);
      };
    }
  }, [appSidebarVisible]);

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
