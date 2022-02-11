import { useCallback } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

import {
  EditEntityModalResponseStatus,
  EditEntityModalResult,
  OpenEditModalParams,
} from '../type';
import {
  editEntityModalSourceState,
  editEntityModalActionTypeState,
  editEntityModalVisibleState,
  editEntityModalTargetTypeState,
  editEntityModalResultState,
  editEntityModalNextSeqState,
} from './editEntityModal';

export const useOpenEditEntityModal = () => {
  const setVisible = useSetRecoilState(editEntityModalVisibleState);
  const setActionType = useSetRecoilState(editEntityModalActionTypeState);
  const setTargetType = useSetRecoilState(editEntityModalTargetTypeState);
  const setSource = useSetRecoilState(editEntityModalSourceState);
  const setNextSeq = useSetRecoilState(editEntityModalNextSeqState);
  const resetResult = useResetRecoilState(editEntityModalResultState);

  const openEditModal = useCallback(
    ({ actionType, targetType, source, nextSeq = 0 }: OpenEditModalParams) => {
      setVisible(true);
      setActionType(actionType);
      setTargetType(targetType);
      setSource(source);
      setNextSeq(nextSeq);
      
      resetResult(); // clear response
    },
    [],
  );

  return openEditModal;
};

export const useCloseEditEntityModal = () => {
  const setVisible = useSetRecoilState(editEntityModalVisibleState);
  const setResult = useSetRecoilState(editEntityModalResultState);

  const closeEditModal = useCallback((result: EditEntityModalResult) => {
    setResult(result);
    setVisible(false);
  }, []);

  return closeEditModal;
};
