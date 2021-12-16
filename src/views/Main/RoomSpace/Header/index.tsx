import React, { FC, useEffect, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { HeaderMain, HeaderSide, RoomSpaceHeader } from './styles';
import { AppState } from '@store/reducers';
import { toggleSpaceVisibleAction } from '@store/reducers/space';
import { TeamData } from '@store/reducers/team';
import { RoomData } from '@store/reducers/room';
import EmojiIcon, { EmojiIconType, EMOJI_PREFIX } from '@components/EmojiIcon';

const DEFAULT_SELECTED_DATA = {
  id: '',
  title: '',
};

interface HeaderProps {
  isRoom: boolean;
}

const Header: FC<HeaderProps> = ({ isRoom }) => {
  const team = useSelector((state: AppState) => state.team);
  const room = useSelector((state: AppState) => state.room);

  let data: TeamData | RoomData = null;
  if (isRoom) {
    const currentRoom = room.list.filter(
      (roomData) => roomData.id === room.selected
    )[0];
    if (currentRoom) {
      data = currentRoom;
    }
  } else {
    const currentTeam = team.list.filter(
      (teamData) => teamData.id === team.selected
    )[0];
    if (currentTeam) {
      data = currentTeam;
    }
  }

  data = data || DEFAULT_SELECTED_DATA;

  const AvatarEl = useMemo(() => {
    const avatar = data.avatar;
    if (!avatar) {
      if (!isRoom) {
        // default chat avatar
        return (
          <Avatar usage={AvatarUsage.RoomSpaceHeader} default>
            <BoxIcon type={BoxIconType.Group} />
          </Avatar>
        );
      }
      return null;
    }

    if (avatar.startsWith(EMOJI_PREFIX)) {
      const type = avatar.substring(EMOJI_PREFIX.length) as EmojiIconType;
      return <EmojiIcon type={type} size={'sm'} />;
    } else {
      return (
        <Avatar usage={AvatarUsage.RoomSpaceHeader} default>
          <BoxIcon type={avatar as BoxIconType} />
        </Avatar>
      );
    }
  }, [data, isRoom]);

  return (
    <RoomSpaceHeader>
      <HeaderMain>
        {AvatarEl}
        <span className="title">{data.title}</span>
      </HeaderMain>
      <HeaderSide>
        <BoxIcon type={BoxIconType.Branch} size={'sm'} clickable />
      </HeaderSide>
    </RoomSpaceHeader>
  );
};

export default Header;
