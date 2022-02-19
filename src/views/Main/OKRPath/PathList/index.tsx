import React, {
  ForwardRefExoticComponent,
  MouseEvent,
  MutableRefObject,
  RefAttributes,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import {
  EntityNode,
  EntityType,
  ViewPointEntity,
} from '@views/Main/state/okrDB/type';
import { useShowExpandBtn } from '@views/Main/state/hooks';
import {
  AbsolutePosition,
  EditEntityModalActionType,
} from '@views/Main/state/type';
import {
  contextMenuPositionState,
  contextMenuTargetState,
  contextMenuVisibleState,
} from '@views/Main/state/modals/customContextMenu';
import useShadowState from '@hooks/useShadowState';
import usePrev from '@hooks/usePrev';
import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { deepCopy } from '@utils';
import { activeNodeState, okrPathListVisibleState } from '../../state/okrPath';
import { entityToNode } from '../PathBoard/utils';
import { PathBoardRef } from '../PathBoard';
import { PathNode } from '../PathBoard/type';
import { PathListSource } from '../type';
import {
  DetailList,
  OKRListContainer,
  OKRListContent,
  OKRListHeader,
} from './styles';
import CommentArea, { CommentAreaRef } from './CommentArea';
import ItemDetail from './ItemDetail';
import ExpandBtn from './ExpandBtn';
import {
  update_addNewNode,
  update_deleteTodoNode,
  update_editNode,
} from './utils';

export interface PathListRef extends CommentAreaRef {
  updateTree(
    actionType: EditEntityModalActionType,
    sourceNode: PathNode,
    entity: ViewPointEntity,
  ): void;
}

interface PathListProps {
  inheritTree: PathListSource;
  boardRef: MutableRefObject<PathBoardRef>;
}

const PathList: ForwardRefExoticComponent<
  PathListProps & RefAttributes<PathListRef>
> = React.forwardRef(({ inheritTree, boardRef }, ref) => {
  const [shadowTree, setShadowTree] = useShadowState(inheritTree);
  const visible = useRecoilValue(okrPathListVisibleState);

  /**
   * 根据 activeNode 更新 expand状态
   */
  const activeNode = useRecoilValue(activeNodeState);
  const prevActiveNode = usePrev(activeNode);
  useEffect(() => {
    if (!inheritTree) {
      // 无继承树 => 组织视图
      return;
    }

    /**
     * 1. activeNode 为空
     */
    if (!activeNode) {
      if (prevActiveNode != null) {
        // 清理上一次的 active 状态
        const newTree = deepCopy(shadowTree);
        const clearIsTarget = (node: EntityNode) => {
          node.isTarget = false;
          Object.values(node.children).forEach((child) => clearIsTarget(child));
        };
        clearIsTarget(newTree);
        setShadowTree(newTree);
      }
      return;
    }

    /**
     * 2. activeNode 不为空
     */
    const targetId = activeNode.id;
    // dfs EntityNode, if exists  => change expand
    const newTree = deepCopy(shadowTree);
    const walkThrough = (node: EntityNode): boolean => {
      if (node.node.type === EntityType.O) {
        node.expand = true; // default expand for O entity
      } else {
        node.expand = false; // clear expand first
      }
      node.isTarget = false;

      /**
       * walk through all nodes(self + children)
       */
      const isSelf = node.node.id === targetId;
      const isInChildren = Object.values(node.children)
        .map((child) => walkThrough(child))
        .reduce((b1, b2) => b1 || b2, false);
      const isInRelativeUsers = node.relativeUsers.some(
        (user) => user.id === targetId,
      );
      if (isSelf || isInChildren || isInRelativeUsers) {
        isSelf && (node.isTarget = true);
        node.expand = true;
        return true;
      }

      return false;
    };
    walkThrough(newTree);
    setShadowTree(newTree);
  }, [activeNode]);

  const hide = !visible || !inheritTree;

  // ========== header ==========
  const headerEl = useMemo(() => {
    if (!inheritTree) {
      return null;
    }

    const { node: userNode } = inheritTree;
    // check user node
    if (userNode.type !== EntityType.User) {
      console.error(`[PathList] invalid inheritTree: none user root node`);
      return null;
    }

    const { avatar, name } = userNode;
    return (
      <OKRListHeader>
        <Avatar>
          <img src={avatar} width={'100%'} />
        </Avatar>
        <div className="info">
          <span>{name}</span>
          <BoxIcon type={BoxIconType.Branch} size={'xs'} />
        </div>
      </OKRListHeader>
    );
  }, [inheritTree]);

  // ========== expand btn ==========
  const showExpandBtn = useShowExpandBtn();
  const detailListRef = useRef<HTMLDivElement>(null);
  const hoverExpandBtn = (
    { left, top }: AbsolutePosition,
    isExpand: boolean,
  ) => {
    const listEl = detailListRef.current;
    const { left: baseLeft, top: baseTop } = listEl.getBoundingClientRect();

    const position: AbsolutePosition = {
      left: left - baseLeft,
      top: top - baseTop + listEl.scrollTop,
    };

    showExpandBtn(position, isExpand);
  };

  // ========== 右键操作 ==========
  const setContextMenuVisible = useSetRecoilState(contextMenuVisibleState);
  const setContextMenuPosition = useSetRecoilState(contextMenuPositionState);
  const setContextMenuTarget = useSetRecoilState(contextMenuTargetState);
  const onRightClick = useCallback((e: MouseEvent, entity: ViewPointEntity) => {
    if (e.button === 2) {
      setContextMenuVisible(true);
      setContextMenuTarget(entityToNode(deepCopy(entity)));
      const { clientX: left, clientY: top } = e;
      setContextMenuPosition({ left, top });

      boardRef.current.listenEdit();
    }
  }, []);

  // ========== outer actions ==========
  const commentAreaRef = useRef<CommentAreaRef>(null);
  useImperativeHandle(
    ref,
    () => {
      const focusComment = () => {
        commentAreaRef.current.focusComment();
      };

      const updateTree = (
        actionType: EditEntityModalActionType,
        sourceNode: PathNode,
        entity: ViewPointEntity,
      ) => {
        const sourceType = sourceNode.data.type;
        switch (actionType) {
          case EditEntityModalActionType.Create: {
            const newTree = update_addNewNode(shadowTree, sourceNode, entity);
            setShadowTree(newTree);
            break;
          }

          case EditEntityModalActionType.Edit: {
            const newTree = update_editNode(shadowTree, sourceNode, entity);
            setShadowTree(newTree);
            break;
          }

          case EditEntityModalActionType.Delete:
            if (sourceType === EntityType.Todo) {
              /**
               * Delete + Todo
               */
              const newTree = update_deleteTodoNode(
                shadowTree,
                sourceNode.data.originId as number,
              );
              setShadowTree(newTree);
            } else {
              /**
               * Delete fail
               */
              console.error(`[PathList.updateTree] delete none todo entity`);
            }
            break;

          case EditEntityModalActionType.Idle:
          default:
            console.warn(
              `[PathList] invoke updateTree with Idle action: actionType = ${actionType}`,
            );
            break;
        }
      };

      return {
        focusComment,
        updateTree,
      };
    },
    [shadowTree],
  );

  return (
    <OKRListContainer className={classNames({ hide })}>
      {headerEl}
      <OKRListContent>
        <DetailList ref={detailListRef}>
          {shadowTree &&
            Object.values(shadowTree.children).map((oEntityNode) => (
              <ItemDetail
                key={oEntityNode.node.id}
                node={oEntityNode}
                hoverExpandBtn={hoverExpandBtn}
                boardRef={boardRef}
                onRightClick={onRightClick}
              />
            ))}
          <ExpandBtn />
        </DetailList>
        <CommentArea ref={commentAreaRef} />
      </OKRListContent>
    </OKRListContainer>
  );
});

export default PathList;
