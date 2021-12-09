import React, { FC } from 'react';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { NavAppContainer } from './styles';
import { noop } from '@utils';

interface NavAppProps {
  icon: BoxIconType;
  title: string;
  onClick?: () => void;
  outerLink?: string;
}

const NavApp: FC<NavAppProps> = ({ icon, title, onClick, outerLink }) => {
  onClick =
    onClick ||
    (outerLink
      ? () => {
          window.open(outerLink, '_blank');
        }
      : noop);

  return (
    <NavAppContainer onClick={onClick}>
      <BoxIcon type={icon} size={'md'} />
      <span>{title}</span>
    </NavAppContainer>
  );
};

export default NavApp;
