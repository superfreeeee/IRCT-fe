import React, { FC, MouseEvent, useMemo, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import { EntityNode, EntityType } from '@views/Main/state/okrDB/type';
import { useHideExpandBtn } from '@views/Main/state/hooks';
import {
  DetailLayer,
  DetailLayerBanner,
  DetailLayerContent,
  RelativeUsers,
} from './styles';
import EnhanceItemTypePoint from './EnhanceItemTypePoint';
import useShadowState from '@hooks/useShadowState';
import { ExpandBtnPosition } from '@views/Main/state/type';
import { expandBtnIsOpenState } from '@views/Main/state/okrPath';

interface ItemDetailProps {
  node: EntityNode;
  hoverExpandBtn?: (position: ExpandBtnPosition, isExpand: boolean) => void;
}

const ItemDetail: FC<ItemDetailProps> = ({
  node: {
    node: { id, type, content, seq },
    children,
    expand,
  },
  hoverExpandBtn,
}) => {
  // const title = [EntityType.Project, EntityType.Todo].includes(type) ?

  const [contentVisible, setContentVisible] = useShadowState(expand);

  const setExpandBtnIsOpen = useSetRecoilState(expandBtnIsOpenState);
  const toggleVisible = (e: MouseEvent) => {
    e.preventDefault();
    // if (expand) {
    //   // unabled to close selected one
    //   return;
    // }
    const next = !contentVisible;
    setContentVisible(next);
    setExpandBtnIsOpen(next);
  };

  const hideExpandLine = [EntityType.Project, EntityType.Todo].includes(type);

  // ========== render children ==========
  const childrenNodes = Object.values(children);
  const childrenEl = useMemo(() => {
    return childrenNodes.map((entityNode) => {
      // KR Layer
      return (
        <ItemDetail
          key={entityNode.node.id}
          node={entityNode}
          hoverExpandBtn={hoverExpandBtn}
        />
      );
    });
  }, [childrenNodes]);

  // ========== render title ==========
  const title = `${type}${seq}：${content}`;

  // ========== hover item type point(to show expand btn) ==========
  const bannerRef = useRef<HTMLDivElement>(null);
  const canExpand = type !== EntityType.Todo && childrenNodes.length > 0;
  const onMouseEnterExpandBtn = () => {
    if (!canExpand) {
      return;
    }
    const { left, top } = bannerRef.current.getBoundingClientRect();
    hoverExpandBtn && hoverExpandBtn({ left, top }, contentVisible);
  };

  const hideExpandBtn = useHideExpandBtn();

  // ========== hover/click title(sync with graph actions) ==========
  const onClickTitle = () => {
    console.group(`[ItemDetail] onClickTitle: ${id}`);
    console.log(`title: ${title}`);
    console.groupEnd();
  };
  const onMouseEnterTitle = () => {
    // console.group(`[ItemDetail] onMouseEnterTitle: ${id}`);
    // console.log(`title: ${title}`);
    // console.groupEnd();
  };
  const onMouseLeaveTitle = () => {
    // console.group(`[ItemDetail] onMouseLeaveTitle: ${id}`);
    // console.log(`title: ${title}`);
    // console.groupEnd();
  };

  return (
    <DetailLayer className={classNames({ hideContent: !contentVisible })}>
      <DetailLayerBanner ref={bannerRef} type={type}>
        <EnhanceItemTypePoint
          type={type}
          lightOn={!contentVisible}
          onClick={toggleVisible}
          onMouseEnter={onMouseEnterExpandBtn}
          onMouseLeave={hideExpandBtn}
        />
        <span
          className="title"
          onClick={onClickTitle}
          onMouseEnter={onMouseEnterTitle}
          onMouseLeave={onMouseLeaveTitle}
        >
          {title}
        </span>
      </DetailLayerBanner>
      <DetailLayerContent className={classNames({ hide: !contentVisible })}>
        <div
          className={classNames('expandLine', { hide: hideExpandLine })}
        ></div>
        <div className="detail">
          <RelativeUsers></RelativeUsers>
          {childrenEl}
        </div>
      </DetailLayerContent>
    </DetailLayer>
  );
};

export default ItemDetail;
