import { atom, selector } from 'recoil';

import { expandVideoRoomState } from './roomSpace';
import { StateNamespace } from './type';
import { createPrefixer } from './utils';

const prefixer = createPrefixer(StateNamespace.AppSidebar);

export const appSidebarVisibleBaseState = atom({
  key: prefixer('appSidebarVisibleBase'),
  default: false,
});

export const appSidebarVisibleState = selector<boolean>({
  key: prefixer('appSidebarVisible'),
  get: ({ get }) => get(appSidebarVisibleBaseState),
  set: ({ set }, visible: boolean) => {
    set(appSidebarVisibleBaseState, visible);
    if (visible) {
      set(expandVideoRoomState, false);
    }
  },
});

export enum AppSidebarType {
  Date = 'Date',
  Doc = 'Doc',
  Todo = 'Todo',
  None = 'None',
}

export const activeAppState = atom({
  key: prefixer('activeApp'),
  default: AppSidebarType.None,
});
