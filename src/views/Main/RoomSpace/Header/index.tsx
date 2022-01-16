import React, { FC, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import {
  persistTempMeetingAction,
  toggleMeetingRoomLockAction,
} from '@store/reducers/room';
import {
  roomBasicInfoFamily,
  roomDataFamily,
  RoomType,
} from '@views/Main/state/room';
import { UserState } from '@views/Main/state/user';
import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import AppIcon from '@components/AppIcon';
import StatusPoint from '@components/StatusPoint';
import {
  HeaderMain,
  HeaderSide,
  HeaderSideBtn,
  RoomSpaceHeader,
} from './styles';

import defaultTeamAvatar from '@assets/img/graphic_2.png';
import newMeetingUrl from '@assets/img/room_action_new_meeting.png';
import lockedUrl from '@assets/img/room_action_lock.png';
import unlockedUrl from '@assets/img/room_action_unlock.png';
import { useRecoilValue } from 'recoil';
import { currentSpaceIdState } from '@views/Main/state/roomSpace';
import { teamDataFamily } from '@views/Main/state/team';

interface HeaderProps {
  isRoom: boolean;
  expand: boolean;
}

const Header: FC<HeaderProps> = ({ isRoom, expand }) => {
  const spaceId = useRecoilValue(currentSpaceIdState);

  // for TeamData
  const teamData = useRecoilValue(teamDataFamily(spaceId));
  const isUser = !isRoom && !teamData.isGroup;
  const roomOfUser = useRecoilValue(
    roomBasicInfoFamily(teamData.currentRoomId),
  );

  // for RoomData
  const roomData = useRecoilValue(roomDataFamily(spaceId));

  // for render
  const data = isRoom ? roomData : teamData;
  const title = isRoom ? roomData.title : teamData.name;
  const avatar = data.avatar;

  const UserSubtitleEl = useMemo(() => {
    if (isUser) {
      const { state, usingApp } = teamData;
      const currentRoomName = roomOfUser?.title;

      const stateText = {
        [UserState.Idle]: 'Now free',
        [UserState.Busy]: 'Now busy',
        [UserState.Talking]: 'Now talking',
      }[state];

      const reasonUsingApp = usingApp && (
        <>
          Now using
          <AppIcon type={usingApp} size={20} />
          {usingApp}
        </>
      );

      const room = currentRoomName && `${stateText} in ${currentRoomName}`;
      return (
        <div className="subtitle">
          <StatusPoint state={state} />
          {reasonUsingApp || room || stateText}
        </div>
      );
    } else {
      return null;
    }
  }, [isUser, teamData]);

  const dispatch = useDispatch();
  const HeaderSideActionsEl = useMemo(() => {
    const { id: roomId, type, locked } = roomData;
    const isMeeting = type === RoomType.Meeting;
    const isTempMeeting = type === RoomType.TempMeeting;

    const MoreActionEl = (
      // ! Do Nothing
      <HeaderSideBtn title="更多">
        <BoxIcon type={BoxIconType.More} size={'sm'} clickable />
      </HeaderSideBtn>
    );

    if (!isRoom) {
      // 1. RoomSpace Header for Team
      const openPath = () => {
        // TODO open Path
        console.log(`[RoomSpace.Header] openPath`);
      };

      return (
        <HeaderSideBtn title="查看 OKR 图" onClick={openPath}>
          <BoxIcon type={BoxIconType.Branch} size={'sm'} clickable />
        </HeaderSideBtn>
      );
    }

    if (isTempMeeting) {
      // 2. RoomSpace Header for TempMeeting
      const persistTempMeeting = bindActionCreators(
        persistTempMeetingAction,
        dispatch,
      );

      return (
        <>
          <HeaderSideBtn
            title="新增永久会议室"
            onClick={() => persistTempMeeting(roomId)}
          >
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

    const showCurrentUsers = () => {
      // TODO show users
      console.log(`[RoomSpace.Header] showCurrentUsers`);
    };

    // 4. RoomSpace Header for Office / Coffee Bar
    return (
      <>
        <HeaderSideBtn title="查看人物列表" onClick={showCurrentUsers}>
          <BoxIcon type={BoxIconType.GroupFill} size={'sm'} clickable />
        </HeaderSideBtn>
        {MoreActionEl}
      </>
    );
  }, [isRoom, roomData]);

  return (
    <RoomSpaceHeader className={classNames({ isRoom, expand })}>
      <HeaderMain>
        <Avatar>
          <img src={avatar || defaultTeamAvatar} width={'100%'} />
        </Avatar>
        <div className="content">
          <div className="title">{title}</div>
          {isUser && UserSubtitleEl}
        </div>
      </HeaderMain>
      <HeaderSide>{HeaderSideActionsEl}</HeaderSide>
    </RoomSpaceHeader>
  );
};

export default Header;
