import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { AppState } from '@store/reducers';
import { TeamData } from '@store/reducers/team';
import {
  RoomData,
  RoomType,
  toggleMeetingRoomLockAction,
} from '@store/reducers/room';
import {
  HeaderMain,
  HeaderSide,
  HeaderSideBtn,
  RoomSpaceHeader,
} from './styles';

import defaultTeamAvatar from '@assets/img/graphic_2.png';
import newMeetingUrl from '@assets/img/room_action_new_meeting.png';
import lockedUrl from '@assets/img/room_action_lock.png';
import unlockedUrl from '@assets/img/room_action_new_meeting.png';
import { bindActionCreators } from 'redux';
// import unlockedUrl from '@assets/img/room_action_unlock.png'

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

  const dispatch = useDispatch();
  const HeaderSideActionsEl = useMemo(() => {
    const { id: roomId, type, locked } = isRoom && (data as RoomData);
    const isMeeting = type === RoomType.Meeting;
    const isTempMeeting = type === RoomType.TempMeeting;

    const MoreActionEl = (
      <HeaderSideBtn title="更多">
        <BoxIcon type={BoxIconType.More} size={'sm'} clickable />
      </HeaderSideBtn>
    );

    if (!isRoom) {
      // 1. RoomSpace Header for Team
      return (
        <HeaderSideBtn title="查看 OKR 图">
          <BoxIcon type={BoxIconType.Branch} size={'sm'} clickable />
        </HeaderSideBtn>
      );
    }

    if (isTempMeeting) {
      // 2. RoomSpace Header for TempMeeting
      return (
        <>
          <HeaderSideBtn title="新增永久会议室">
            <img src={newMeetingUrl} width={24} />
          </HeaderSideBtn>
          {MoreActionEl}
        </>
      );
    }

    if (isMeeting) {
      // 3.RoomSpace Header for Meeting
      const toggleMeetingRoomLock = bindActionCreators(
        toggleMeetingRoomLockAction,
        dispatch,
      );
      return (
        <>
          <HeaderSideBtn
            title={locked ? '点解解锁' : '点击锁定'}
            onClick={() => toggleMeetingRoomLock(roomId)}
          >
            <img src={locked ? lockedUrl : unlockedUrl} width={24} />
          </HeaderSideBtn>
          {MoreActionEl}
        </>
      );
    }

    // 4. RoomSpace Header for Office / Coffee Bar
    return (
      <>
        <HeaderSideBtn title="查看人物列表">
          <BoxIcon type={BoxIconType.GroupFill} size={'sm'} clickable />
        </HeaderSideBtn>
        {MoreActionEl}
      </>
    );
  }, [isRoom, data]);

  return (
    <RoomSpaceHeader className={classNames({ isRoom, expand })}>
      <HeaderMain>
        <Avatar>
          <img src={data.avatar || defaultTeamAvatar} width={'100%'} />
        </Avatar>
        <span className="title">{data.title}</span>
      </HeaderMain>
      <HeaderSide>{HeaderSideActionsEl}</HeaderSide>
    </RoomSpaceHeader>
  );
};

export default Header;
