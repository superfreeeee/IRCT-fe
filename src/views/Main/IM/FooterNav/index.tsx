import React from 'react';

import { BoxIconType } from '@components/BoxIcon';
import { FooterNavContainer } from './styles';
import NavApp from './NavApp';
import {
  activeAppState,
  AppSidebarType,
  appSidebarVisibleState,
} from '@views/Main/state/appSidebar';
import { useSetRecoilState } from 'recoil';
import { okrPathVisibleState } from '@views/Main/state/okrPath';

const FooterNav = () => {
  const setAppSidebarVisible = useSetRecoilState(appSidebarVisibleState);
  const setActiveApp = useSetRecoilState(activeAppState);

  const clickDate = () => {
    console.log(`[FooterNav] clickDate`);
    setAppSidebarVisible(true);
    setActiveApp(AppSidebarType.Date);
  };

  const clickDoc = () => {
    console.log(`[FooterNav] clickDoc`);
    setAppSidebarVisible(true);
    setActiveApp(AppSidebarType.Doc);
  };

  const setOKRPathVisible = useSetRecoilState(okrPathVisibleState);
  const clickPath = () => {
    console.log(`[FooterNav] clickPath`);
    setOKRPathVisible(true);
  };

  const clickTodo = () => {
    console.log(`[FooterNav] clickTodo`);
    setAppSidebarVisible(true);
    setActiveApp(AppSidebarType.Todo);
  };

  return (
    <FooterNavContainer>
      <NavApp icon={BoxIconType.Calender} title={'Date'} onClick={clickDate} />
      <NavApp icon={BoxIconType.File} title={'Doc'} onClick={clickDoc} />
      <NavApp icon={BoxIconType.Branch} title={'Path'} onClick={clickPath} />
      <NavApp icon={BoxIconType.ListCheck} title={'Todo'} onClick={clickTodo} />
    </FooterNavContainer>
  );
};

export default FooterNav;
