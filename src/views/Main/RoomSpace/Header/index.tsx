import React, { FC, useMemo, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import {
  roomBasicInfoFamily,
  roomDataFamily,
  roomLockedFamily,
} from '@views/Main/state/room';
import {
  UserState,
  RoomType,
  ViewPointStackActionType,
} from '@views/Main/state/type';
import { currentSpaceIdState } from '@views/Main/state/roomSpace';
import { teamDataFamily } from '@views/Main/state/team';
import {
  createMeetingModalInfoState,
  createMeetingModalVisibleState,
} from '@views/Main/state/modals/createMeetingModal';
import { selectUserModalControllerInfoState } from '@views/Main/state/modals/selectUserModal';
import { SELECT_USER_MODAL_WIDTH } from '@views/Main/modals/SelectUserModal/styles';
import {
  okrPathVisibleState,
  viewPointStackUpdater,
} from '@views/Main/state/okrPath';
import { ViewPointType } from '@views/Main/state/okrDB/type';
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
  const setRoomLocked = useSetRecoilState(roomLockedFamily(spaceId));

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

  const setCreateMeetingModalVisible = useSetRecoilState(
    createMeetingModalVisibleState,
  );
  const setCreateMeetingModalInfo = useSetRecoilState(
    createMeetingModalInfoState,
  );
  const setSelectUserModalControllerInfo = useSetRecoilState(
    selectUserModalControllerInfoState,
  );
  const setOKRPathVisible = useSetRecoilState(okrPathVisibleState);
  const updateStack = useSetRecoilState(viewPointStackUpdater);
  const actionBtnRef = useRef<HTMLDivElement>(null); // 按钮位置信息
  const HeaderSideActionsEl = useMemo(() => {
    const { id: roomId, type, locked } = roomData;
    const isMeeting = type === RoomType.Meeting;
    const isTempMeeting = type === RoomType.TempMeeting;

    const { id: teamId } = teamData;

    const MoreActionEl = (
      // ! Do Nothing
      <HeaderSideBtn title="更多">
        <BoxIcon type={BoxIconType.More} size={'sm'} clickable />
      </HeaderSideBtn>
    );

    if (!isRoom) {
      // 1. RoomSpace Header for Team
      const openPath = () => {
        console.log(`[RoomSpace.Header] openPath: ${teamId}`);
        setOKRPathVisible(true);
        updateStack({
          type: ViewPointStackActionType.Push,
          record: {
            type: ViewPointType.Personal,
            centerUserId: teamId,
          },
        });
      };

      return (
        <HeaderSideBtn title="查看 OKR 图" onClick={openPath}>
          <BoxIcon type={BoxIconType.Branch} size={'sm'} clickable />
        </HeaderSideBtn>
      );
    }

    if (isTempMeeting) {
      // 2. RoomSpace Header for TempMeeting
      const openCreateModal = () => {
        console.log(`[RoomSpace.Header] openCreateModal: ${roomId}`);
        setCreateMeetingModalVisible(true);
        setCreateMeetingModalInfo({ roomId });
      };

      return (
        <>
          <HeaderSideBtn title="新增永久会议室" onClick={openCreateModal}>
            <img src={newMeetingUrl} width={24} />
          </HeaderSideBtn>
          {MoreActionEl}
        </>
      );
    }

    if (isMeeting) {
      // 3.RoomSpace Header for Meeting
      const toggleMeetingRoomLock = () => {
        setRoomLocked(!locked);
      };
      return (
        <>
          <HeaderSideBtn
            title={locked ? '点解解锁' : '点击锁定'}
            onClick={toggleMeetingRoomLock}
          >
            <img src={locked ? lockedUrl : unlockedUrl} width={24} />
          </HeaderSideBtn>
          {MoreActionEl}
        </>
      );
    }

    const showCurrentUsers = () => {
      const { bottom, right } = actionBtnRef.current.getBoundingClientRect();
      const position = { left: right - SELECT_USER_MODAL_WIDTH, top: bottom };
      setSelectUserModalControllerInfo({
        visible: true,
        position,
        selectable: false,
        scopeRoomId: roomId,
      });
    };

    // 4. RoomSpace Header for Office / Coffee Bar
    return (
      <>
        <HeaderSideBtn
          ref={actionBtnRef}
          title="查看人物列表"
          onClick={showCurrentUsers}
        >
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
