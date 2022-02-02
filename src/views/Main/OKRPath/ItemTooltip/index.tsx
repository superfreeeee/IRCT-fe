import React, { FC, MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import classNames from 'classnames';

import {
  tooltipDataState,
  tooltipPositionState,
  tooltipVisibleState,
} from '@views/Main/state/okrPath';

import { ItemTooltipWrapper } from './styles';
import { EntityType } from '@views/Main/state/okrDB/type';
import { userStateFamily } from '@views/Main/state/user';
import StatusPoint from '@components/StatusPoint';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import ItemTypePoint from './ItemTypePoint';

interface ItemTooltipProps {
  containerRef: MutableRefObject<HTMLDivElement>;
}

const ItemTooltip: FC<ItemTooltipProps> = ({ containerRef }) => {
  // ========== 展示相关 ==========
  const visible = useRecoilValue(tooltipVisibleState);
  const [position, setPosition] = useRecoilState(tooltipPositionState);

  const wrapperRef = useRef<HTMLDivElement>(null);
  /**
   * 超出界限时重新定位 reshape
   */
  const reshapLockRef = useRef(false);
  useEffect(() => {
    if (reshapLockRef.current) {
      return;
    }
    setTimeout(() => {
      const { right: rightLimit, left: offsetX } =
        containerRef.current.getBoundingClientRect();
      const { x, y, width, right } = wrapperRef.current.getBoundingClientRect();

      if (y < 0 || right >= rightLimit) {
        const bottom = y < 0 ? position.bottom - 90 : position.bottom;
        const left =
          right >= rightLimit ? right - width - offsetX : position.left;
        setPosition({
          left,
          bottom,
        });
        reshapLockRef.current = true;
      }
    });
  }, [position]);

  /**
   * 隐藏时重置锁
   */
  useEffect(() => {
    if (!visible) {
      reshapLockRef.current = false;
    }
  }, [visible]);

  // ========== 内容相关 ==========
  const item = useRecoilValue(tooltipDataState);

  const isUser = item && item.data.type === EntityType.User;
  const userState = useRecoilValue(userStateFamily(item && item.data.id));

  const contentEl = useMemo(() => {
    // TODO clear console
    // console.log(`[ItemTooltip] item`, item);

    if (!item) {
      return null;
    }

    if (isUser) {
      // for user
      const userName = isUser && item.data.name;

      return (
        <>
          <div className="user">
            <BoxIcon type={BoxIconType.UserCircle} size={'xs'} />
            <span>{userName}</span>
          </div>
          <StatusPoint state={userState} size={6} />
        </>
      );
    } else {
      // for item
      const itemColor = item.store.hoverColor;
      const content = `${item.data.type}${item.seq}: ${item.data.content}`;

      return (
        <>
          <ItemTypePoint color={itemColor} size={6} />
          <span className="content">{content}</span>
        </>
      );
    }
  }, [item]);

  return (
    <ItemTooltipWrapper
      ref={wrapperRef}
      className={classNames({ hide: !visible })}
      style={{ ...position }}
    >
      {contentEl}
    </ItemTooltipWrapper>
  );
};

export default ItemTooltip;
