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

const EditEntityModal = () => {
  // outer state
  const visible = useRecoilValue(editEntityModalVisibleState);
  const actionType = useRecoilValue(editEntityModalActionTypeState);
  const targetType = useRecoilValue(editEntityModalTargetTypeState);
  const source = useRecoilValue(editEntityModalSourceState);
  const nextSeq = useRecoilValue(editEntityModalNextSeqState);

  const sourceDeps = [actionType, targetType, source, nextSeq];

  // form state
  const [content, onContentChange, { setInput: setContent }] = useInput();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent('');
  }, sourceDeps);

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

    const content = contentRef.current.value;

    if (actionType === EditEntityModalActionType.Create) {
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
      };

      console.log(`[EditEntityModal] confirm`, result);

      closeModal({
        status: EditEntityModalResponseStatus.Confirm,
        payload: result,
      });
    } else if (actionType === EditEntityModalActionType.Edit) {
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
      };

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
  useClickDetect(
    wrapperRef,
    (isOutside) => {
      if (isOutside) {
        cancel();
      }
    },
    visible,
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
  const mainEl = useMemo(() => {
    if (actionType === EditEntityModalActionType.Idle) {
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
      return (
        <EditEntityModalMain>
          <div className="deleteText">Are you sure to delete the node?</div>
          {mainActionsEl}
        </EditEntityModalMain>
      );
    }

    return (
      <EditEntityModalMain>
        <EditContent inputRef={contentRef} />
        <div>{actionType} entity</div>
        {mainActionsEl}
      </EditEntityModalMain>
    );
  }, [sourceDeps, content, onContentChange]);

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
