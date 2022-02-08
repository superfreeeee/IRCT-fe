import React, { FC, MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import classNames from 'classnames';

import {
  tooltipDataState,
  tooltipPositionState,
  tooltipVisibleState,
} from '@views/Main/state/okrPath';
import { EntityType } from '@views/Main/state/okrDB/type';
import { userStateFamily } from '@views/Main/state/user';
import StatusPoint from '@components/StatusPoint';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { ItemTooltipContainer, ItemTooltipWrapper } from './styles';
import ItemTypePoint from './ItemTypePoint';

interface ItemTooltipProps {}

const ItemTooltip: FC<ItemTooltipProps> = () => {
  // ========== 展示相关 ==========
  const visible = useRecoilValue(tooltipVisibleState);
  const [position, setPosition] = useRecoilState(tooltipPositionState);
  const targetNode = useRecoilValue(tooltipDataState);

  const innerContainerRef = useRef<HTMLDivElement>(null);
  /**
   * 超出界限时重新定位 reshape
   */
  const reshapLockRef = useRef(false);
  useEffect(() => {
    if (reshapLockRef.current || !targetNode) {
      return;
    }
    setTimeout(() => {
      const { y } = innerContainerRef.current.getBoundingClientRect();

      if (y < 0) {
        const diameter = targetNode.store.radius * 2;
        const newBottom = position.bottom - diameter;
        setPosition({
          left: position.left,
          bottom: newBottom,
        });
        reshapLockRef.current = true;
      }
    });
  }, [targetNode, position]);

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
  const userState = useRecoilValue(
    userStateFamily(item && (item.data.originId as string)),
  );

  const contentEl = useMemo(() => {
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
    <ItemTooltipContainer
      ref={innerContainerRef}
      className={classNames({ hide: !visible, turn: reshapLockRef.current })}
      style={{ ...position }}
    >
      <ItemTooltipWrapper>{contentEl}</ItemTooltipWrapper>
    </ItemTooltipContainer>
  );
};

export default ItemTooltip;
