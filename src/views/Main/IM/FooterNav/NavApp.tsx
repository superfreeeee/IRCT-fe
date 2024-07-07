import React, { FC } from 'react';

import BoxIcon, { BoxIconType } from '@/components/BoxIcon';
import { NavAppWrapper } from './styles';
import { noop, openNewPage } from '@/utils';

interface NavAppProps {
  icon: BoxIconType;
  title: string;
  onClick?: () => void;
  outerLink?: string;
}

const NavApp: FC<NavAppProps> = ({ icon, title, onClick, outerLink }) => {
  if (!onClick) {
    if (outerLink) {
      onClick = () => openNewPage(outerLink);
    } else {
      onClick = noop;
    }
  }

  return (
    <NavAppWrapper onClick={onClick}>
      <BoxIcon type={icon} size={'sm'} />
      <span>{title}</span>
    </NavAppWrapper>
  );
};

export default NavApp;
