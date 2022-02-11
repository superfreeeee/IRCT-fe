import { atom, selector } from 'recoil';

import { PathNode } from '@views/Main/OKRPath/PathBoard/type';
import {
  DEFAULT_CONTEXT_MENU_POSITION,
  DEFAULT_CONTEXT_MENU_VISIBLE,
} from '../defaults';
import { AbsolutePosition, StateNamespace } from '../type';
import { createPrefixer } from '../utils';

const prefixer = createPrefixer(StateNamespace.ContextMenu);

const contextMenuVisibleBaseState = atom<boolean>({
  key: prefixer('contextMenuVisibleBase'),
  default: DEFAULT_CONTEXT_MENU_VISIBLE,
});

export const contextMenuVisibleState = selector<boolean>({
  key: prefixer('contextMenuVisible'),
  get: ({ get }) => {
    const visible = get(contextMenuVisibleBaseState);
    const hasTarget = get(contextMenuTargetState);

    return !!hasTarget && visible;
  },
  set: ({ set }, visible) => {
    set(contextMenuVisibleBaseState, visible);
  },
});

export const contextMenuPositionState = atom<AbsolutePosition>({
  key: prefixer('contextMenuPosition'),
  default: DEFAULT_CONTEXT_MENU_POSITION,
});

export const contextMenuTargetState = atom<PathNode>({
  key: prefixer('contextMenuTarget'),
  default: null,
});
