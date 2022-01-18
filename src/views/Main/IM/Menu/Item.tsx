import React, { FC, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import { TabOption, UserState } from '@views/Main/state/type';
import {
  currentTabState,
  stateTooltipInfoState,
  stateTooltipVisibleState,
} from '@views/Main/state/im';
import {
  roomBasicInfoFamily,
  RoomData,
  roomUserIdsFamily,
} from '@views/Main/state/room';
import { RoomType } from '@views/Main/state/type';
import { TeamData } from '@views/Main/state/team';
import {
  callModalInfoState,
  callModalVisibleState,
} from '@views/Main/state/callModal';
import {
  userCustomBusyFamily,
  userTalkingStateFamily,
} from '@views/Main/state/user';
import { lastChatRecordFamily } from '@views/Main/state/roomSpace';

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
import { MenuData } from './type';

import graphic2Avatar from '@assets/img/graphic_2.png';
import lockedUrl from '@assets/img/room_action_lock.png';
import CALL_ICON_URL from '@assets/img/team_action_call.png';
import FOLLOR_ICON_URL from '@assets/img/team_action_follow.png';
import COLLABORATE_ICON_URL from '@assets/img/team_action_collaborate.png';
import { useEnterRoom } from '@views/Main/state/hooks';

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
  onSelect: (data: MenuData) => void;
}

const Item: FC<ItemProps> = ({ currentTab, selected, data, onSelect }) => {
  const isRoom = currentTab === TabOption.Room;

  // for RoomData
  const currentRoom = data as RoomData;

  const isMeeting = isRoom && currentRoom.type === RoomType.Meeting;
  const meetingLocked = isMeeting && currentRoom.locked;
  const members = useRecoilValue(roomUserIdsFamily(currentRoom.id)).length;

  // for TeamData
  const currentTeam = data as TeamData;
  const roomOfcurrentTeam = useRecoilValue(
    roomBasicInfoFamily(currentTeam.currentRoomId),
  );
  const lastChatRecord = useRecoilValue(lastChatRecordFamily(currentTeam.id));

  const isUser = !isRoom && !currentTeam.isGroup;
  const isUserUsingApp = isUser && currentTeam.usingApp;

  // TeamData 可选操作
  const currentState = currentTeam.state;

  const canCall = currentState === UserState.Idle;
  const askCall = currentState === UserState.Busy;
  const canFollow = currentState !== UserState.Busy;
  const canCollaborate = isUserUsingApp;

  // for render (cross team & room)
  const title = isRoom ? currentRoom.title : currentTeam.name;
  const avatar = isRoom ? currentRoom.avatar : currentTeam.avatar;

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

  const setCurrentTab = useSetRecoilState(currentTabState);
  const enterRoom = useEnterRoom(roomOfcurrentTeam?.id, currentTeam.id);
  /**
   * 2 - 跟随
   */
  const userActionFollow = (e) => {
    e.stopPropagation();

    enterRoom(true);
    if (currentTab === TabOption.Team) {
      setCurrentTab(TabOption.Room);
    }
  };

  /**
   * 3 - 协作
   */
  const userActionCollaborate = (e) => {
    e.stopPropagation();
    console.log(`[Menu.Item] userActionCollaborate`);
  };

  // for Room Actions
  /**
   * 加入新房间
   */
  const enterNewRoom = useEnterRoom(currentRoom.id, currentTeam.id);
  const joinNewRoom = (e) => {
    e.stopPropagation();

    enterNewRoom();
    if (currentTab === TabOption.Team) {
      setCurrentTab(TabOption.Room);
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
        <div className="subtitle">{lastChatRecord && lastChatRecord.text}</div>
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
          <span>{lastChatRecord && lastChatRecord.createTime}</span>
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
              {(canCall || askCall) && (canFollow || canCollaborate) && (
                <ItemActionDivider />
              )}
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
