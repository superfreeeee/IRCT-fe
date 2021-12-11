import React, { FC } from 'react';

import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { HeaderMain, HeaderSide, RoomSpaceHeader } from './styles';

interface HeaderProps {
  isRoom: boolean;
}

const Header: FC<HeaderProps> = ({ isRoom }) => {
  return (
    <RoomSpaceHeader>
      <HeaderMain>
        {isRoom ? (
          <span>Coffee Room</span>
        ) : (
          <>
            <Avatar usage={AvatarUsage.RoomSpaceHeader} />
            <span>Joe Zhao</span>
          </>
        )}
      </HeaderMain>
      <HeaderSide>
        <BoxIcon type={BoxIconType.Branch} size={'sm'} clickable />
      </HeaderSide>
    </RoomSpaceHeader>
  );
};

export default Header;
