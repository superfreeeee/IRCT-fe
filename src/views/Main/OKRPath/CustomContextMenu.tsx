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

import useClickDetect from '@/hooks/useClickDetect';
import BoxIcon, { BoxIconType } from '@/components/BoxIcon';
import { deepCopy } from '@/utils';
import { EntityType, ViewPointType } from '../state/okrDB/type';
import {
  contextMenuPositionState,
  contextMenuTargetState,
  contextMenuVisibleState,
} from '../state/modals/customContextMenu';
import { okrPathVisibleState, viewPointStackUpdater } from '../state/okrPath';
import {
  EditEntityModalActionType,
  TabOption,
  ViewPointStackActionType,
} from '../state/type';
import { currentSpaceIdState } from '../state/roomSpace';
import { currentTabState, selectedTeamIdState } from '../state/im';
import { useOpenEditEntityModal } from '../state/modals/hooks';
import { getEntityChildNextSeq } from '../state/okrDB/api';
import { ContextMenuOption } from './type';
import { PathListRef } from './PathList';
import ContextMenu from '@/components/ContextMenu';

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

const _createTargetTypeMap: { [sourceType in EntityType]: EntityType } = {
  [EntityType.User]: EntityType.O,
  [EntityType.O]: EntityType.KR,
  [EntityType.KR]: EntityType.Project,
  [EntityType.Project]: EntityType.Todo,
  [EntityType.Todo]: null,
};

interface CustomContextMenuProps {
  listRef: MutableRefObject<PathListRef>;
}

const CustomContextMenu: FC<CustomContextMenuProps> = ({ listRef }) => {
  const setVisible = useSetRecoilState(contextMenuVisibleState);
  const [targetNode, setTargetNode] = useRecoilState(contextMenuTargetState);

  const closeMenu = useCallback(() => {
    setVisible(false);
    setTargetNode(null); // reset when menu closed
  }, []);

  const onCancel = closeMenu;

  // ========== render options(dep on targetNode) ==========
  const updateStack = useSetRecoilState(viewPointStackUpdater);
  const setOKRPathVisible = useSetRecoilState(okrPathVisibleState);
  const setTab = useSetRecoilState(currentTabState);
  const setSelectedTeamId = useSetRecoilState(selectedTeamIdState);
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);
  const openModal = useOpenEditEntityModal();
  const optionsEl = useMemo(() => {
    if (!targetNode) {
      return null;
    }

    // ========== state ==========
    const {
      data: { originId, type, relative },
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
      console.log(`[CustomContextMenu] pushPath: ${originId}`);
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
      console.log(`[CustomContextMenu] editNode: ${type} ${originId}`);
      openModal({
        actionType: EditEntityModalActionType.Edit,
        targetType: type,
        source: deepCopy(targetNode),
      });
      closeMenu();
    };

    const createNode = () => {
      console.log(`[CustomContextMenu] createNode: ${type} ${originId}`);
      const targetType = _createTargetTypeMap[type];
      if (!targetType) {
        console.error(`[CustomContextMenu] invalid createNode base on Todo`);
        closeMenu();
        return;
      }

      openModal({
        actionType: EditEntityModalActionType.Create,
        targetType,
        source: deepCopy(targetNode),
        nextSeq: getEntityChildNextSeq({ type, id: originId }),
      });
      closeMenu();
    };

    const deleteNode = () => {
      console.log(`[CustomContextMenu] deleteNode: ${type} ${originId}`);
      openModal({
        actionType: EditEntityModalActionType.Delete,
        targetType: type,
        source: deepCopy(targetNode),
      });
      closeMenu();
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
          title: '新增 KR',
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
          title: '新增项目',
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
          title: '新增 Todo',
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
          iconType: BoxIconType.Trash,
          title: '删除',
          onClick: deleteNode,
        },
      ],
    };

    const options = optionsMap[type];

    if (type === EntityType.User && !relative) {
      options.push({
        iconType: BoxIconType.MessageAdd,
        title: '新增 O',
        onClick: createNode,
      });
    }

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

  return <ContextMenu onCancel={onCancel}>{optionsEl}</ContextMenu>;
};

export default CustomContextMenu;
