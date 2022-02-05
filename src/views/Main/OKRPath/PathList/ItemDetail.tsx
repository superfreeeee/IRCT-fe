import React, {
  FC,
  MouseEvent,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import { EntityNode, EntityType } from '@views/Main/state/okrDB/type';
import { useHideExpandBtn } from '@views/Main/state/hooks';
import { ExpandBtnPosition } from '@views/Main/state/type';
import { expandBtnIsOpenState } from '@views/Main/state/okrPath';
import useShadowState from '@hooks/useShadowState';
import { PathBoardRef } from '../PathBoard';
import {
  DetailLayer,
  DetailLayerBanner,
  DetailLayerContent,
  RelativeUsers,
} from './styles';
import EnhanceItemTypePoint from './EnhanceItemTypePoint';

interface ItemDetailProps {
  node: EntityNode;
  hoverExpandBtn?: (position: ExpandBtnPosition, isExpand: boolean) => void;
  boardRef: MutableRefObject<PathBoardRef>;
}

const ItemDetail: FC<ItemDetailProps> = ({
  node: {
    node: { id, type, content, seq },
    children,
    expand,
    isTarget,
  },
  node,
  hoverExpandBtn,
  boardRef,
}) => {
  // inner controll switch: node 更新时同步 expand 状态
  const [contentVisible, setContentVisible] = useShadowState(expand, [node]);

  const setExpandBtnIsOpen = useSetRecoilState(expandBtnIsOpenState);
  const toggleVisible = (e: MouseEvent) => {
    e.preventDefault();

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
          boardRef={boardRef}
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

    boardRef.current.clickNode(id);
  };
  const onMouseEnterTitle = () => {
    // console.group(`[ItemDetail] onMouseEnterTitle: ${id}`);
    // console.log(`title: ${title}`);
    // console.groupEnd();
    boardRef.current.enterNode(id);
  };
  const onMouseLeaveTitle = () => {
    // console.group(`[ItemDetail] onMouseLeaveTitle: ${id}`);
    // console.log(`title: ${title}`);
    // console.groupEnd();
    boardRef.current.leaveNode(id);
  };

  return (
    <DetailLayer>
      <DetailLayerBanner ref={bannerRef} type={type}>
        <EnhanceItemTypePoint
          type={type}
          lightOn={!contentVisible && canExpand} // 有内容才亮灯
          onClick={toggleVisible}
          onMouseEnter={onMouseEnterExpandBtn}
          onMouseLeave={hideExpandBtn}
        />
        <span
          className={classNames('title', { isTarget })}
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
