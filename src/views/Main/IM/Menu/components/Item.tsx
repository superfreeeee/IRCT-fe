import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import StatusPoint from '@components/StatusPoint';
import UnreadPin from '@components/UnreadPin';
import classNames from 'classnames';
import React, { FC, useCallback, useRef } from 'react';

import { ItemContainer } from '../styles';
import { MenuData } from '../type';

export interface ItemProps {
  selected: boolean;
  data: MenuData;
  showTooltip: (content: string, position) => void;
  closeTooltip: () => void;
  onSelect: (id: string) => void;
}

const Item: FC<ItemProps> = ({
  selected,
  data: { id, title, state, unread, usingApp },
  showTooltip,
  closeTooltip,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseOver = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const pos = {
      bottom: window.innerHeight - rect.top + 12,
      left: (rect.left + rect.right) / 2,
    };
    showTooltip('Hello Tooltip' as string, pos);
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
      <div className="left">
        <Avatar usage={AvatarUsage.IMMenuItem} />
        <span className="title">{title}</span>
      </div>
      {(usingApp || state) && (
        <div className="right">
          <span>{usingApp}</span>
        </div>
      )}
      {/* 未读信息 */}
      {unread && <UnreadPin num={unread} />}
      {/* 状态点 */}
      {state && <StatusPoint state={state} style={{ right: 11, bottom: 18 }} />}
    </ItemContainer>
  );
};

export default Item;
