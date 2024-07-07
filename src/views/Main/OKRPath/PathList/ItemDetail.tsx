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

import {
  EntityNode,
  EntityType,
  ViewPointEntity,
} from '@/views/Main/state/okrDB/type';
import { useHideExpandBtn } from '@/views/Main/state/hooks';
import { AbsolutePosition } from '@/views/Main/state/type';
import { expandBtnIsOpenState } from '@/views/Main/state/okrPath';
import useShadowState from '@/hooks/useShadowState';
import { PathBoardRef } from '../PathBoard';
import {
  DetailLayer,
  DetailLayerBanner,
  DetailLayerContent,
  RelativeUsers,
} from './styles';
import EnhanceItemTypePoint from './EnhanceItemTypePoint';
import Avatar from '@/components/Avatar';

interface ItemDetailProps {
  node: EntityNode;
  hoverExpandBtn?: (position: AbsolutePosition, isExpand: boolean) => void;
  boardRef: MutableRefObject<PathBoardRef>;
  onRightClick?: (e: MouseEvent, entity: ViewPointEntity) => void;
}

const ItemDetail: FC<ItemDetailProps> = ({
  node: {
    node: { id, type, content, seq },
    node: entity,
    children,
    relativeUsers,
    expand,
    isTarget,
  },
  node,
  hoverExpandBtn,
  boardRef,
  onRightClick,
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

  // ========== render relativeUsers ==========
  const relativeUsersEl = useMemo(() => {
    if (relativeUsers.length === 0) {
      return null;
    }

    return (
      <RelativeUsers>
        {relativeUsers.map((user) => {
          return (
            //
            <Avatar key={user.id} onMouseDown={(e) => onRightClick(e, user)}>
              <img src={user.avatar} width={'100%'} />
            </Avatar>
          );
        })}
      </RelativeUsers>
    );
  }, [relativeUsers]);

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
          onRightClick={onRightClick}
        />
      );
    });
  }, [childrenNodes]);

  // ========== render props ==========
  // state
  const hideExpandLine = [EntityType.Project, EntityType.Todo].includes(type);
  const hasContent = childrenNodes.length > 0 || relativeUsers.length > 0;

  // content
  const title = `${type}${seq}：${content}`;

  // ========== hover item type point(to show expand btn) ==========
  const bannerRef = useRef<HTMLDivElement>(null);
  const onMouseEnterExpandBtn = () => {
    if (!hasContent) {
      return;
    }
    const { left, top } = bannerRef.current.getBoundingClientRect();
    hoverExpandBtn && hoverExpandBtn({ left, top }, contentVisible);
  };

  const hideExpandBtn = useHideExpandBtn();

  // ========== hover/click title(sync with graph actions) ==========
  const onClickTitle = () => {
    boardRef.current.clickNode(id);
  };
  const onMouseEnterTitle = () => {
    boardRef.current.enterNode(id);
  };
  const onMouseLeaveTitle = () => {
    boardRef.current.leaveNode(id);
  };

  const onMouseDownTitle = (e: MouseEvent) => {
    onRightClick(e, entity);
  };

  return (
    <DetailLayer>
      <DetailLayerBanner ref={bannerRef} type={type}>
        <EnhanceItemTypePoint
          type={type}
          lightOn={!contentVisible && hasContent} // 有内容才亮灯
          onClick={toggleVisible}
          onMouseEnter={onMouseEnterExpandBtn}
          onMouseLeave={hideExpandBtn}
        />
        <span
          className={classNames('title', { isTarget })}
          onClick={onClickTitle}
          onMouseEnter={onMouseEnterTitle}
          onMouseLeave={onMouseLeaveTitle}
          onMouseDown={onMouseDownTitle}
        >
          {title}
        </span>
      </DetailLayerBanner>
      <DetailLayerContent className={classNames({ hide: !contentVisible })}>
        <div
          className={classNames('expandLine', { hide: hideExpandLine })}
        ></div>
        <div className="detail">
          {relativeUsersEl}
          {childrenEl}
        </div>
      </DetailLayerContent>
    </DetailLayer>
  );
};

export default ItemDetail;
