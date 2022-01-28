import React, { FC, MutableRefObject, useEffect, useRef } from 'react';
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
  const node = useRecoilValue(tooltipDataState);
  const isUser = node && node.data.type === EntityType.User;

  // for user
  const userName = isUser && node.data.name;
  const userState = useRecoilValue(userStateFamily(isUser && node.data.id));

  // for item

  console.log(`[ItemTooltip] node`, node);

  const contentEl =
    node &&
    (isUser ? (
      <>
        <div className="user">
          <BoxIcon type={BoxIconType.UserCircle} size={'xs'} />
          <span>{userName}</span>
        </div>
        <StatusPoint state={userState} size={6} />
      </>
    ) : (
      <>item</>
    ));

  return (
    <ItemTooltipWrapper
      ref={wrapperRef}
      className={classNames({ hide: !visible })}
      style={{ ...position }}
    >
      {contentEl}
      {/* KR43: 支持B产品开发上线，保障平台稳定，bug数量低于N */}
    </ItemTooltipWrapper>
  );
};

export default ItemTooltip;
