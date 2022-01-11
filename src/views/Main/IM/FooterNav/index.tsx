import React from 'react';

import { BoxIconType } from '@components/BoxIcon';
import { FooterNavContainer } from './styles';
import NavApp from './NavApp';

const FooterNav = () => {
  const clickDate = () => {
    console.log(`[FooterNav] clickDate`);
  };

  const clickDoc = () => {
    console.log(`[FooterNav] clickDoc`);
  };

  const clickPath = () => {
    console.log(`[FooterNav] clickPath`);
  };

  const clickTodo = () => {
    console.log(`[FooterNav] clickTodo`);
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
