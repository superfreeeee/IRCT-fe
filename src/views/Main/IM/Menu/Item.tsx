import React, { FC, useMemo, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import {
  currentTabState,
  selectedRoomInfoState,
  stateTooltipInfoState,
  stateTooltipVisibleState,
  TabOption,
} from '@views/Main/state/im';
import {
  roomBasicInfoFamily,
  RoomData,
  RoomType,
} from '@views/Main/state/room';
import { TeamData } from '@views/Main/state/team';

import { AppState } from '@store/reducers';
import { switchSpaceAction } from '@store/reducers/space';
import Avatar from '@components/Avatar';
import StatusPoint from '@components/StatusPoint';
import AppIcon from '@components/AppIcon';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import {
  ItemActionBtn,
  ItemActionDivider,
  ItemActionIcon,
  ItemActions,
  ItemContainer,
  ItemOptionalRoom,
} from './styles';
import { ItemExtraData, MenuData } from './type';

import graphic2Avatar from '@assets/img/graphic_2.png';
import lockedUrl from '@assets/img/room_action_lock.png';
import {
  callModalInfoState,
  callModalVisibleState,
} from '@views/Main/state/callModal';

import CALL_ICON_URL from '@assets/img/team_action_call.png';
import FOLLOR_ICON_URL from '@assets/img/team_action_follow.png';
import COLLABORATE_ICON_URL from '@assets/img/team_action_collaborate.png';
import {
  userCustomBusyFamily,
  userTalkingStateFamily,
  userVideoVoiceSwitchFamily,
} from '@views/Main/state/user';

const useTooltip = (data: TeamData, roomName: string) => {
  const setStateTooltipVisible = useSetRecoilState(stateTooltipVisibleState);
  const setStateTooltipInfo = useSetRecoilState(stateTooltipInfoState);

  const debounceLock = useRef(false);
  const onMouseEnter = (e) => {
    if (debounceLock.current) {
      return;
    }
    const el = e.target as HTMLElement;
    const { left, top } = el.getBoundingClientRect();
    setStateTooltipInfo({
      position: { left, top },
      state: data.state,
      room: roomName,
      usingApp: data.usingApp,
    });
    setStateTooltipVisible(true);
  };

  const onMouseLeave = (e) => {
    debounceLock.current = true;

    setTimeout(() => {
      setStateTooltipVisible(false);
      debounceLock.current = false;
    }, 100);
  };

  return {
    onMouseEnter,
    onMouseLeave,
  };
};

export interface ItemProps {
  currentTab: TabOption;
  selected: boolean;
  data: MenuData;
  extraData?: ItemExtraData;
  onSelect: (data: MenuData) => void;
}

const Item: FC<ItemProps> = ({
  currentTab,
  selected,
  data,
  data: { id, avatar },
  extraData: { subtitle, members, lastRecordTime } = {},
  onSelect,
}) => {
  const isRoom = currentTab === TabOption.Room;

  // for RoomData
  const currentRoom = data as RoomData;

  const isMeeting = isRoom && currentRoom.type === RoomType.Meeting;
  const meetingLocked = isMeeting && currentRoom.locked;

  // for TeamData
  const currentTeam = data as TeamData;
  const roomOfcurrentTeam = useRecoilValue(
    roomBasicInfoFamily(currentTeam.currentRoomId),
  );

  const isUser = !isRoom && !currentTeam.isGroup;
  const isUserInRoom = isUser && roomOfcurrentTeam;
  const isInIdelRoom =
    isUserInRoom && roomOfcurrentTeam.type === RoomType.Coffee;
  const isUserUsingApp = isUser && currentTeam.usingApp;
  const isUserCustomBusy = useRecoilValue(userCustomBusyFamily(currentTeam.id));
  const isUserTalking = useRecoilValue(userTalkingStateFamily(currentTeam.id));

  const canCall =
    (!isUserInRoom && !isUserUsingApp && !isUserCustomBusy) ||
    (isUserInRoom && isUserTalking && isInIdelRoom);
  const askCall =
    (!isUserInRoom && (isUserUsingApp || isUserCustomBusy)) ||
    (isUserInRoom && !isUserTalking && !isUserUsingApp && !isUserCustomBusy);
  const canFollow = isUserInRoom;
  const canCollaborate = isUserUsingApp;

  // for render (cross team & room)
  const title = isRoom ? currentRoom.title : currentTeam.name;

  /**
   * 用户状态 tooltip
   */
  const { onMouseEnter, onMouseLeave } = useTooltip(
    data as TeamData,
    currentRoom.title,
  );

  // for Team Actions
  const setCallModalVisible = useSetRecoilState(callModalVisibleState);
  const setCallModalInfo = useSetRecoilState(callModalInfoState);
  /**
   * 1 - 语音通话
   */
  const userActionCall = (e) => {
    e.stopPropagation();
    console.log(`[Menu.Item] userActionCall(shouldAsk = ${askCall})`);

    const { id, name, avatar } = currentTeam;
    setCallModalInfo({
      avatar,
      userId: id,
      userName: name,
      responsed: false,
      accept: false,
    });
    setCallModalVisible(true);
  };

  const dispatch = useDispatch();
  const setCurrentTab = useSetRecoilState(currentTabState);
  const setSelectedRoomInfo = useSetRecoilState(selectedRoomInfoState);
  /**
   * 2 - 跟随
   */
  const userActionFollow = (e) => {
    e.stopPropagation();
    if (roomOfcurrentTeam) {
      console.log(`[Menu.Item] userActionFollow`, roomOfcurrentTeam);
      setSelectedRoomInfo({ roomId: roomOfcurrentTeam.id, followeeId: id });
      if (currentTab === TabOption.Team) {
        setCurrentTab(TabOption.Room);

        const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
        switchSpace(TabOption.Room);
      }
    } else {
      console.error(
        `[Menu.Item] userActionFollow: unknown roomId = ${currentTeam.currentRoomId}`,
      );
    }
  };

  /**
   * 3 - 协作
   */
  const userActionCollaborate = (e) => {
    e.stopPropagation();
    console.log(`[Menu.Item] userActionCollaborate`);
  };

  const currentSpace = useSelector(
    (state: AppState) => state.space.currentSpace,
  );

  // for Room Actions
  /**
   * 加入新房间
   */
  const joinNewRoom = () => {
    setSelectedRoomInfo({ roomId: currentRoom.id, followeeId: '' });
    if (currentSpace === TabOption.Team) {
      const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
      switchSpace(TabOption.Room);
    }
  };

  const showActions = (!isRoom && isUser) || (isRoom && !selected);

  return (
    <ItemContainer
      className={classNames({ selected, isRoom, isGroup: !isUser })}
      onClick={() => onSelect(data)}
    >
      <div className="avatar">
        <Avatar>
          <img
            src={avatar || graphic2Avatar}
            width={'100%'}
            alt={'wrong url'}
          />
        </Avatar>
        {isUserUsingApp && <AppIcon type={currentTeam.usingApp} size={20} />}
      </div>
      <div className="content">
        <div className="title">
          <span>{title}</span>
          {isUser && (
            <span
              style={{ padding: 3, marginLeft: 2 }}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <StatusPoint state={currentTeam.state} size={8} />
            </span>
          )}
        </div>
        <div className="subtitle">{subtitle}</div>
      </div>
      <div className={classNames('optional', { inTeam: !isRoom })}>
        {isRoom ? (
          <ItemOptionalRoom>
            {isMeeting && meetingLocked ? (
              <img src={lockedUrl} width={18} />
            ) : (
              <>
                <BoxIcon type={BoxIconType.Volume} size={'xs'} />
                {members}
              </>
            )}
          </ItemOptionalRoom>
        ) : (
          <span>{lastRecordTime}</span>
        )}
      </div>
      {/* 未读信息 */}
      {/* // TODO posible add back in future */}
      {/* {unread && <UnreadPin num={unread} />} */}
      {/* 更多操作 */}
      {showActions && (
        <ItemActions>
          {isRoom ? (
            // Room Actions: join
            <ItemActionBtn onClick={joinNewRoom}>join</ItemActionBtn>
          ) : isUser ? (
            // Team Actions: 语音、跟随、协作
            <>
              {(canCall || askCall) && (
                <ItemActionIcon onClick={userActionCall} title="发起语音通话">
                  <img src={CALL_ICON_URL} width={'100%'} />
                </ItemActionIcon>
              )}
              {(canCall || askCall) && canFollow && <ItemActionDivider />}
              {canFollow && (
                <ItemActionIcon onClick={userActionFollow} title="跟随">
                  <img src={FOLLOR_ICON_URL} width={'100%'} />
                </ItemActionIcon>
              )}
              {canFollow && canCollaborate && <ItemActionDivider />}
              {canCollaborate && (
                <ItemActionIcon onClick={userActionCollaborate} title="协作">
                  <img src={COLLABORATE_ICON_URL} width={'100%'} />
                </ItemActionIcon>
              )}
            </>
          ) : null}
        </ItemActions>
      )}
    </ItemContainer>
  );
};

export default Item;
