import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { AppState } from '@store/reducers';
import { TeamData } from '@store/reducers/team';
import { RoomData } from '@store/reducers/room';
import {
  HeaderMain,
  HeaderSide,
  HeaderSideBtn,
  RoomSpaceHeader,
} from './styles';

import defaultTeamAvatar from '@assets/img/graphic_2.png';

const DEFAULT_SELECTED_DATA = {
  id: '',
  title: '',
};

interface HeaderProps {
  isRoom: boolean;
  expand: boolean;
}

const Header: FC<HeaderProps> = ({ isRoom, expand }) => {
  const team = useSelector((state: AppState) => state.team);
  const room = useSelector((state: AppState) => state.room);

  let data: TeamData | RoomData = null;
  if (isRoom) {
    const currentRoom = room.list.filter(
      (roomData) => roomData.id === room.selected,
    )[0];
    if (currentRoom) {
      data = currentRoom;
    }
  } else {
    const currentTeam = team.list.filter(
      (teamData) => teamData.id === team.selected,
    )[0];
    if (currentTeam) {
      data = currentTeam;
    }
  }

  data = data || DEFAULT_SELECTED_DATA;

  return (
    <RoomSpaceHeader className={classNames({ isRoom, expand })}>
      <HeaderMain>
        <Avatar>
          <img src={data.avatar || defaultTeamAvatar} width={'100%'} />
        </Avatar>
        <span className="title">{data.title}</span>
      </HeaderMain>
      <HeaderSide>
        <HeaderSideBtn>
          <BoxIcon type={BoxIconType.GroupFill} size={'sm'} clickable />
        </HeaderSideBtn>
        <HeaderSideBtn>
          <BoxIcon type={BoxIconType.More} size={'sm'} clickable />
        </HeaderSideBtn>
      </HeaderSide>
    </RoomSpaceHeader>
  );
};

export default Header;
