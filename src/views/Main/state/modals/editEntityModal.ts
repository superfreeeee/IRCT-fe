import { atom, selector } from 'recoil';

import { PathNode } from '@views/Main/OKRPath/PathBoard/type';
import {
  EditEntityModalActionType,
  EditEntityModalResponseStatus,
  EditEntityModalResult,
  StateNamespace,
} from '../type';
import { createPrefixer } from '../utils';
import { EntityType } from '../okrDB/type';

const prefixer = createPrefixer(StateNamespace.EditEntityModal);

export const editEntityModalVisibleBaseState = atom<boolean>({
  key: prefixer('editEntityModalVisibleBase'),
  default: true,
});

export const editEntityModalVisibleState = selector<boolean>({
  key: prefixer('editEntityModalVisible'),
  get: ({ get }) => {
    const visible = get(editEntityModalVisibleBaseState);
    const type = get(editEntityModalActionTypeState);
    const source = get(editEntityModalSourceState);

    return !!source && type !== EditEntityModalActionType.Idle && visible;
  },
  set: ({ set }, visible) => {
    set(editEntityModalVisibleBaseState, visible);
  },
});

export const editEntityModalActionTypeState = atom<EditEntityModalActionType>({
  key: prefixer('editEntityModalActionType'),
  default: EditEntityModalActionType.Idle,
});

export const editEntityModalTargetTypeState = atom<EntityType>({
  key: prefixer('editEntityModalTargetType'),
  default: EntityType.User,
});

export const editEntityModalSourceState = atom<PathNode>({
  key: prefixer('editEntityModalSource'),
  default: null,
});

export const editEntityModalNextSeqState = atom<number>({
  key: prefixer('editEntityModalNextSeq'),
  default: 0,
});

export const editEntityModalResultState = atom<EditEntityModalResult>({
  key: prefixer('editEntityModalResult'),
  default: {
    status: EditEntityModalResponseStatus.Waiting,
    payload: null,
  },
});
