import React, { FC, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import EmojiIcon, { EmojiIconType, EMOJI_PREFIX } from '@components/EmojiIcon';
import StatusPoint from '@components/StatusPoint';
import UnreadPin from '@components/UnreadPin';
import { AppState } from '@store/reducers';
import { TabOption } from '../../type';
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
  data: { id, avatar, title, state, unread, usingApp },
  showTooltip,
  closeTooltip,
  onSelect,
}) => {
  const currentSpace = useSelector(
    (state: AppState) => state.space.currentSpace
  );
  const isRoom = currentSpace === TabOption.Room;

  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseOver = useCallback(() => {
    const rect = containerRef.current.getBoundingClientRect();
    const pos = {
      bottom: window.innerHeight - rect.top + 12,
      left: (rect.left + rect.right) / 2,
    };
    // showTooltip('Hello Tooltip' as string, pos);
  }, [showTooltip]);

  // const AvatarEl = useMemo(() => {
  //   if (!avatar) {
  //     return isRoom ? (
  //       <EmojiIcon type={EmojiIconType.Man} size={20} />
  //     ) : (
  //       <BoxIcon type={BoxIconType.Group} />
  //     );
  //   }

  //   if (avatar.startsWith(EMOJI_PREFIX)) {
  //     const type = avatar.substring(EMOJI_PREFIX.length) as EmojiIconType;
  //     return <EmojiIcon type={type} size={20} />;
  //   } else {
  //     return <BoxIcon type={BoxIconType.Group} />;
  //   }
  // }, [isRoom, avatar]);

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
        <BoxIcon type={BoxIconType.Group} />
      </Avatar>
      <div className="content">
        <div className="title">{title}</div>
        <div className="subtitle">{title}</div>
      </div>
      <div className="optional">
        {/* <span>{usingApp}</span> */}
      </div>
      {/* 未读信息 */}
      {/* // TODO check unread is need or not */}
      {/* {unread && <UnreadPin num={unread} />} */}
      {/* 状态点 */}
      {/* {state && <StatusPoint state={state} style={{ right: 11, bottom: 18 }} />} */}
    </ItemContainer>
  );
};

export default Item;
