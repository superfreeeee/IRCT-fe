import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import Modal from '@components/Modal';
import {
  editEntityModalSourceState,
  editEntityModalActionTypeState,
  editEntityModalVisibleState,
  editEntityModalTargetTypeState,
  editEntityModalNextSeqState,
} from '@views/Main/state/modals/editEntityModal';
import {
  EntityType,
  UserEntity,
  ViewPointEntity,
  ViewPointRelation,
} from '@views/Main/state/okrDB/type';
import {
  EditEntityModalActionType,
  EditEntityModalResponseStatus,
} from '@views/Main/state/type';
import { useCloseEditEntityModal } from '@views/Main/state/modals/hooks';
import useInput from '@hooks/useInput';
import useClickDetect from '@hooks/useClickDetect';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import ItemTypePoint from '../ItemTooltip/ItemTypePoint';
import {
  EditEntityModalBtn,
  EditEntityModalHeader,
  EditEntityModalMain,
  EditEntityModalMainActions,
  EditEntityModalMask,
  EditEntityModalWrapper,
  headerPointColorMap,
} from './styles';
import EditContent from './EditContent';
import SelectedUserList from './SelectedUserList';
import { selectUserModalVisibleState } from '@views/Main/state/modals/selectUserModal';
import { getRelativeUsers } from '@views/Main/state/okrDB/api';
import { viewPointCenterUserIdState } from '@views/Main/state/okrPath';

const EditEntityModal = () => {
  // outer state
  const visible = useRecoilValue(editEntityModalVisibleState);
  const actionType = useRecoilValue(editEntityModalActionTypeState);
  const targetType = useRecoilValue(editEntityModalTargetTypeState);
  const source = useRecoilValue(editEntityModalSourceState);
  const nextSeq = useRecoilValue(editEntityModalNextSeqState);

  const sourceDeps = [actionType, targetType, source, nextSeq];

  // form state
  const contentRef = useRef<string>('');
  const usersRef = useRef<UserEntity[]>([]);

  // ========== actions ==========
  const closeModal = useCloseEditEntityModal();
  const cancel = useCallback(() => {
    console.log(`[EditEntityModal] cancel`);
    closeModal({
      status: EditEntityModalResponseStatus.Cancel,
    });
  }, []);

  const confirm = useCallback(() => {
    if (
      [
        EditEntityModalActionType.Idle,
        EditEntityModalActionType.Delete,
      ].includes(actionType)
    ) {
      console.log(`[EditEntityModal] confirm`);
      closeModal({
        status: EditEntityModalResponseStatus.Confirm,
      });
      return;
    }

    const content = contentRef.current;
    const users = usersRef.current;

    if (actionType === EditEntityModalActionType.Create) {
      /**
       * 新增节点、边
       */
      const entity: ViewPointEntity = {
        type: targetType,
        id: '',
        originId: -1,
        seq: nextSeq,
        content,
      };

      const relation: ViewPointRelation = {
        source: source.data.id,
        target: '',
      };

      const result = {
        entity,
        relation,
        selectedUsers: undefined,
      };

      if (
        [EntityType.O, EntityType.Project, EntityType.Todo].includes(targetType)
      ) {
        result.selectedUsers = users;
      }

      console.log(`[EditEntityModal] confirm`, result);

      closeModal({
        status: EditEntityModalResponseStatus.Confirm,
        payload: result,
      });
    } else if (actionType === EditEntityModalActionType.Edit) {
      /**
       * 修改节点、边
       */
      const {
        data: { type, id, originId, seq },
      } = source;
      const entity: ViewPointEntity = {
        type,
        id,
        originId,
        seq,
        content,
      };

      const result = {
        entity,
        selectedUsers: undefined,
      };

      if (
        [EntityType.O, EntityType.Project, EntityType.Todo].includes(targetType)
      ) {
        result.selectedUsers = users;
      }

      console.log(`[EditEntityModal] confirm`, result);

      closeModal({
        status: EditEntityModalResponseStatus.Confirm,
        payload: result,
      });
    } else {
      console.warn(
        `[EditEntityModal] confirm unknown actionType: ${actionType}`,
      );
    }
  }, sourceDeps);

  // ========== outside click detect ==========
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectUserModalVisible = useRecoilValue(selectUserModalVisibleState);
  useClickDetect(
    wrapperRef,
    (isOutside) => {
      if (isOutside) {
        cancel();
      }
    },
    visible && !selectUserModalVisible,
  );

  // ========== render header ==========
  const headerEl = useMemo(() => {
    if (
      [
        EditEntityModalActionType.Delete,
        EditEntityModalActionType.Idle,
      ].includes(actionType)
    ) {
      return null;
    }

    const {
      data: { type, seq },
    } = source;

    let title: string;
    switch (actionType) {
      case EditEntityModalActionType.Edit:
        title = `Editing node: ${type} ${seq}`;
        break;

      case EditEntityModalActionType.Create:
        title = `Create new node: ${targetType} ${nextSeq}`;
        break;

      default:
        title = ``;
        break;
    }

    return (
      <EditEntityModalHeader type={targetType}>
        <ItemTypePoint color={headerPointColorMap[targetType]} size={8} />
        <span>{title}</span>
        {actionType === EditEntityModalActionType.Edit && (
          <div className="actions">
            <BoxIcon type={BoxIconType.Trash} size={'xs'} onClick={cancel} />
          </div>
        )}
      </EditEntityModalHeader>
    );
  }, sourceDeps);

  // ========== render Main ==========
  const centerUserId = useRecoilValue(viewPointCenterUserIdState);
  const mainEl = useMemo(() => {
    if (actionType === EditEntityModalActionType.Idle) {
      /**
       * 0. Idle => 无作为
       */
      return null;
    }

    const mainActionsEl = (
      <EditEntityModalMainActions>
        <EditEntityModalBtn onClick={cancel}>Cancel</EditEntityModalBtn>
        <EditEntityModalBtn className="primary" onClick={confirm}>
          Confirm
        </EditEntityModalBtn>
      </EditEntityModalMainActions>
    );

    if (actionType === EditEntityModalActionType.Delete) {
      /**
       * 1. 删除
       */
      return (
        <EditEntityModalMain>
          <div className="deleteText">Are you sure to delete the node?</div>
          {mainActionsEl}
        </EditEntityModalMain>
      );
    }

    /**
     * 2. 编辑 / 新建
     */
    const {
      data: { originId, content },
    } = source;
    let relativeUsers: UserEntity[];
    if (
      [EntityType.KR, EntityType.User].includes(targetType) ||
      (actionType === EditEntityModalActionType.Create &&
        [EntityType.O, EntityType.Project].includes(targetType))
    ) {
      /**
       * 2.1
       *   User, KR 无关联用户
       *
       * 2.2
       *   新建 O、Project 时无关联人物
       */
      relativeUsers = [];
    } else {
      /**
       * 2.3 其他
       *   编辑 O、Project、Todo
       *   新建 Todo
       */
      const id = targetType === EntityType.Todo ? centerUserId : originId;
      relativeUsers = getRelativeUsers({
        type: targetType,
        id,
        action: actionType,
      });
    }

    const initContent =
      actionType === EditEntityModalActionType.Create ? '' : content;

    return (
      <EditEntityModalMain>
        <EditContent content={initContent} contentRef={contentRef} />
        <SelectedUserList
          targetType={targetType}
          users={relativeUsers}
          usersRef={usersRef}
        />
        {mainActionsEl}
      </EditEntityModalMain>
    );
  }, [...sourceDeps, centerUserId]);

  useEffect(() => {
    console.log(`[EditEntityModal] source`, source);
  }, sourceDeps);

  return (
    <Modal visible={visible}>
      <EditEntityModalMask>
        <EditEntityModalWrapper ref={wrapperRef}>
          {headerEl}
          {mainEl}
        </EditEntityModalWrapper>
      </EditEntityModalMask>
    </Modal>
  );
};

export default EditEntityModal;
