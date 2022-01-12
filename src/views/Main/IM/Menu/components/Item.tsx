import React, { FC, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import Avatar from '@components/Avatar';
import { AppState } from '@store/reducers';
import { TabOption } from '../../type';
import { ItemActionBtn, ItemActions, ItemContainer } from '../styles';
import { ItemExtraData, MenuData } from '../type';

import graphic2Avatar from '@assets/img/graphic_2.png';
import { enterRoomAction, RoomData } from '@store/reducers/room';
import { bindActionCreators } from 'redux';
import StatusPoint from '@components/StatusPoint';
import { TeamData } from '@store/reducers/team';

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

  const dispatch = useDispatch();
  const joinNewRoom = () => {
    const enterRoom = bindActionCreators(enterRoomAction, dispatch);
    enterRoom(data as RoomData);
  };

  const showActions = !isRoom || !selected;

  return (
    <ItemContainer
      className={classNames({ selected, isRoom })}
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
          {!isRoom ? (
            <>
              <div>btn1</div>
              <div>btn2</div>
            </>
          ) : (
            <ItemActionBtn onClick={joinNewRoom}>join</ItemActionBtn>
          )}
        </ItemActions>
      )}
    </ItemContainer>
  );
};

export default Item;
