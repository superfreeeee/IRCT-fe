import React, {
  FC,
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import classNames from 'classnames';

import {
  contextMenuPositionState,
  contextMenuTargetState,
  contextMenuVisibleState,
} from '../state/modals/customContextMenu';
import useClickDetect from '@hooks/useClickDetect';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { EntityType, ViewPointType } from '../state/okrDB/type';
import { ContextMenuOption } from './type';
import { okrPathVisibleState, viewPointStackUpdater } from '../state/okrPath';
import { TabOption, ViewPointStackActionType } from '../state/type';
import { PathListRef } from './PathList';
import { currentSpaceIdState } from '../state/roomSpace';
import { currentTabState, selectedTeamIdState } from '../state/im';

const CustomContextMenuContainer = styled.div`
  position: fixed;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--trans_speed_level3),
    visibility var(--trans_speed_level3);

  &.visible {
    opacity: 1;
    visibility: visible;
  }
`;

const CustomContextMenuWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 100px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  background-color: #474849;
`;

const CustomContextMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 3px 6px;
  border-radius: 5px;
  color: #fff;
  font-size: 12px;

  &:hover {
    background-color: #5b5b5b;
  }
`;

interface CustomContextMenuProps {
  listRef: MutableRefObject<PathListRef>;
}

const CustomContextMenu: FC<CustomContextMenuProps> = ({ listRef }) => {
  const [visible, setVisible] = useRecoilState(contextMenuVisibleState);
  const position = useRecoilValue(contextMenuPositionState);
  const [targetNode, setTargetNode] = useRecoilState(contextMenuTargetState);

  const closeMenu = useCallback(() => {
    setVisible(false);
    setTargetNode(null); // reset when menu closed
  }, []);

  // ========== click outside and close ==========
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickDetect(
    wrapperRef,
    (isOutSide) => {
      if (isOutSide) {
        closeMenu();
      }
    },
    visible,
  );

  // ========== render options(dep on targetNode) ==========
  const updateStack = useSetRecoilState(viewPointStackUpdater);
  const setOKRPathVisible = useSetRecoilState(okrPathVisibleState);
  const setTab = useSetRecoilState(currentTabState);
  const setSelectedTeamId = useSetRecoilState(selectedTeamIdState);
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);
  const optionsEl = useMemo(() => {
    if (!targetNode) {
      return null;
    }

    // ========== state ==========
    const {
      data: { originId, type },
    } = targetNode;

    // ========== actions ==========
    const goChat = () => {
      console.log(`[CustomContextMenu] goChat`);
      setOKRPathVisible(false);
      setTab(TabOption.Team);
      setSelectedTeamId(originId as string);
      setCurrentSpaceId(originId as string);

      closeMenu();
    };

    const pushPath = () => {
      console.log(`[CustomContextMenu] pushPath`);
      updateStack({
        type: ViewPointStackActionType.Push,
        record: {
          type: ViewPointType.Personal,
          centerUserId: originId as string, // userId
        },
      });
      closeMenu();
    };

    const editNode = () => {
      console.log(`[CustomContextMenu] editNode`);
    };

    const createNode = () => {
      console.log(`[CustomContextMenu] createNode`);
    };

    const deleteNode = () => {
      console.log(`[CustomContextMenu] deleteNode`);
    };

    // ========== options ==========
    const optionsMap: { [type in EntityType]: ContextMenuOption[] } = {
      [EntityType.User]: [
        {
          iconType: BoxIconType.MessageDots,
          title: '发送消息',
          onClick: goChat,
        },
        {
          iconType: BoxIconType.Branch,
          title: '进入Path',
          onClick: pushPath,
        },
      ],
      [EntityType.O]: [
        {
          iconType: BoxIconType.Edit,
          title: '编辑',
          onClick: editNode,
        },
        {
          iconType: BoxIconType.MessageAdd,
          title: '新增 O',
          onClick: createNode,
        },
      ],
      [EntityType.KR]: [
        {
          iconType: BoxIconType.Edit,
          title: '编辑',
          onClick: editNode,
        },
        {
          iconType: BoxIconType.MessageAdd,
          title: '新增 KR',
          onClick: createNode,
        },
      ],
      [EntityType.Project]: [
        {
          iconType: BoxIconType.Edit,
          title: '编辑',
          onClick: editNode,
        },
        {
          iconType: BoxIconType.MessageAdd,
          title: '新增项目',
          onClick: createNode,
        },
      ],
      [EntityType.Todo]: [
        {
          iconType: BoxIconType.Edit,
          title: '编辑',
          onClick: editNode,
        },
        {
          iconType: BoxIconType.MessageAdd,
          title: '新增 Todo',
          onClick: createNode,
        },
        {
          iconType: BoxIconType.Trash,
          title: '删除',
          onClick: deleteNode,
        },
      ],
    };

    const options = optionsMap[type];

    // ========== render ==========
    return (
      <CustomContextMenuWrapper>
        {options.map(({ iconType, iconUrl, title, onClick }) => (
          <CustomContextMenuItem key={title} onClick={onClick}>
            {iconType ? (
              <BoxIcon type={iconType} size={'xs'} />
            ) : iconUrl ? (
              <img src={iconUrl} width={16} />
            ) : null}
            <span>{title}</span>
          </CustomContextMenuItem>
        ))}
      </CustomContextMenuWrapper>
    );
  }, [targetNode]);

  return (
    <CustomContextMenuContainer
      ref={wrapperRef}
      className={classNames({ visible })}
      style={{ ...position }}
    >
      {optionsEl}
    </CustomContextMenuContainer>
  );
};

export default CustomContextMenu;
