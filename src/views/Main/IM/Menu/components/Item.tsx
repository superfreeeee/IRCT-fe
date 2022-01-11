import React, { FC, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import Avatar from '@components/Avatar';
import { AppState } from '@store/reducers';
import { TabOption } from '../../type';
import { ItemContainer } from '../styles';
import { ItemExtraData, MenuData } from '../type';

import graphic2Avatar from '@assets/img/graphic_2.png';
import { RoomData } from '@store/reducers/room';

export interface ItemProps {
  currentTab: TabOption;
  selected: boolean;
  data: MenuData;
  extraData?: ItemExtraData;
  showTooltip: (content: string, position) => void;
  closeTooltip: () => void;
  onSelect: (id: string) => void;
}

const Item: FC<ItemProps> = ({
  currentTab,
  selected,
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
    // showTooltip('Hello Tooltip' as string, pos);
  }, [showTooltip]);

  return (
    <ItemContainer
      className={classNames({ selected })}
      // @ts-ignore
      ref={containerRef}
      onClick={() => onSelect(id)}
      onMouseOver={onMouseOver}
      onMouseLeave={closeTooltip}
    >
      <Avatar>
        <img src={avatar || graphic2Avatar} width={'100%'} alt={'wrong url'} />
      </Avatar>
      <div className="content">
        <div className="title">
          <span>{title}</span>
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
    </ItemContainer>
  );
};

export default Item;
