import React, { FC, useCallback, useMemo, useRef } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { enterRoomAction, RoomData, RoomType } from '@store/reducers/room';
import { TeamData } from '@store/reducers/team';
import Avatar from '@components/Avatar';
import StatusPoint from '@components/StatusPoint';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { TabOption } from '../../type';
import {
  ItemActionBtn,
  ItemActionDivider,
  ItemActionIcon,
  ItemActions,
  ItemContainer,
} from '../styles';
import {
  CALL_ICON_URL,
  COLLABORATE_ICON_URL,
  FOLLOR_ICON_URL,
  ItemExtraData,
  MenuData,
} from '../type';

import graphic2Avatar from '@assets/img/graphic_2.png';
import { AppState } from '@store/reducers';
import { switchTabAction } from '@store/reducers/im';
import { switchSpaceAction } from '@store/reducers/space';

export interface ItemProps {
  currentTab: TabOption;
  selected: boolean;
  data: MenuData;
  extraData?: ItemExtraData;
  showTooltip: (content: string, position) => void;
  closeTooltip: () => void;
  onSelect: (data: MenuData) => void;
}

const Item: FC<ItemProps> = ({
  currentTab,
  selected,
  data,
  data: { id, avatar, title },
  extraData: { subtitle, members } = {},
  showTooltip,
  closeTooltip,
  onSelect,
}) => {
  const isRoom = currentTab === TabOption.Room;

  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseOver = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const pos = {
      bottom: window.innerHeight - rect.top + 12,
      left: (rect.left + rect.right) / 2,
    };
    // TODO fix tooltip
    showTooltip('Hello Tooltip' as string, pos);
  }, [showTooltip]);

  const rooms = useSelector((state: AppState) => state.room.list);

  /**
   * Team 列表下状态判断
   */
  const { isUser, canCall, askCall, canFollow, canCollaborate } =
    useMemo(() => {
      const { state, currentRoom, usingApp } = data as TeamData;

      const isUser = !isRoom && !!state;
      if (!isUser) {
        return {
          isUser,
          canCall: false,
          askCall: false,
          canFollow: false,
          canCollaborate: false,
        };
      }

      const currentRoomType =
        rooms.filter((room) => room.id === currentRoom)[0]?.type || RoomType;
      const isCoffe = currentRoomType === RoomType.Coffee;

      // 二段状态
      const isUserInRoom = isUser && !!currentRoom;
      const isUsingApp = isUser && !!usingApp;
      const isCustomBusy = false;

      const openMicrophone = true;

      // 最终按钮选择
      const canCall =
        (!isUserInRoom && !isUsingApp && !isCustomBusy) ||
        (isUserInRoom && openMicrophone && isCoffe);
      const askCall =
        (!isUserInRoom && (isUsingApp || isCustomBusy)) ||
        (isUserInRoom && !openMicrophone && !isUsingApp && !isCustomBusy);
      const canFollow = isUserInRoom;
      const canCollaborate = isUsingApp;

      return {
        isUser,
        canCall,
        askCall,
        canFollow,
        canCollaborate,
      };
    }, [data]);

  const userActionCall = (e) => {
    e.stopPropagation();
    console.log(`[Menu.Item] userActionCall(shouldAsk = ${askCall})`);
  };

  const dispatch = useDispatch();

  const userActionFollow = (e) => {
    e.stopPropagation();
    const roomId = (data as TeamData).currentRoom;
    const room = rooms.filter((room) => room.id === roomId)[0];
    if (room) {
      console.log(`[Menu.Item] userActionFollow`, room);
      const enterRoom = bindActionCreators(enterRoomAction, dispatch);
      enterRoom(room);
      if (currentTab === TabOption.Team) {
        const switchTab = bindActionCreators(switchTabAction, dispatch);
        const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
        switchTab(TabOption.Room);
        switchSpace(TabOption.Room);
      }
    } else {
      console.error(`[Menu.Item] userActionFollow: unknown roomId = ${roomId}`);
    }
  };

  const userActionCollaborate = (e) => {
    e.stopPropagation();
    console.log(`[Menu.Item] userActionCollaborate`);
  };

  /**
   * 加入新房间
   */
  const joinNewRoom = () => {
    const enterRoom = bindActionCreators(enterRoomAction, dispatch);
    enterRoom(data as RoomData);
  };

  const showActions = (!isRoom && isUser) || (isRoom && !selected);

  return (
    <ItemContainer
      className={classNames({ selected, isRoom, isGroup: !isUser })}
      // @ts-ignore
      ref={containerRef}
      onClick={() => onSelect(data)}
      // onMouseOver={onMouseOver}
      // onMouseLeave={closeTooltip}
    >
      <Avatar>
        <img src={avatar || graphic2Avatar} width={'100%'} alt={'wrong url'} />
      </Avatar>
      <div className="content">
        <div className="title">
          <span>{title}</span>
          <StatusPoint
            state={(data as TeamData).state}
            size={8}
            onMouseOver={onMouseOver}
            onMouseLeave={closeTooltip}
            style={{ margin: 5 }}
          />
        </div>
        <div className="subtitle">{subtitle}</div>
      </div>
      <div className={classNames('optional', { inTeam: !isRoom })}>
        {isRoom ? <span>{members}</span> : <span>12:00</span>}
      </div>
      {/* 未读信息 */}
      {/* // TODO posible add back in future */}
      {/* {unread && <UnreadPin num={unread} />} */}
      {/* 状态点 */}
      {/* {state && <StatusPoint state={state} style={{ right: 11, bottom: 18 }} />} */}
      {showActions && (
        <ItemActions>
          {isRoom ? (
            // Room Actions
            <ItemActionBtn onClick={joinNewRoom}>join</ItemActionBtn>
          ) : isUser ? (
            // Team Actions
            <>
              {(canCall || askCall) && (
                <ItemActionIcon onClick={userActionCall}>
                  <img src={CALL_ICON_URL} width={'100%'} />
                </ItemActionIcon>
              )}
              {(canCall || askCall) && canFollow && <ItemActionDivider />}
              {canFollow && (
                <ItemActionIcon onClick={userActionFollow}>
                  <img src={FOLLOR_ICON_URL} width={'100%'} />
                </ItemActionIcon>
              )}
              {canFollow && canCollaborate && <ItemActionDivider />}
              {canCollaborate && (
                <ItemActionIcon onClick={userActionCollaborate}>
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
