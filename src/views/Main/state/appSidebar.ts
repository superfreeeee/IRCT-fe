import { atom, selector } from 'recoil';

import { expandVideoRoomState } from './roomSpace';

export const appSidebarVisibleBaseState = atom({
  key: 'appSidebar_appSidebarVisibleBase',
  default: false,
});

export const appSidebarVisibleState = selector<boolean>({
  key: 'appSidebar_appSidebarVisible',
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
  key: 'appSidebar_activeApp',
  default: AppSidebarType.None,
});
