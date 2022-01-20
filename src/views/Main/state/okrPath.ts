import { atom, selector } from 'recoil';

import { DEFAULT_OKR_List_VISIBLE, DEFAULT_OKR_PATH_VISIBLE } from './defaults';
import { StateNamespace } from './type';
import { createPrefixer } from './utils';

const prefixer = createPrefixer(StateNamespace.OKRPath);

/**
 * OKR Path 页面
 */
export const okrPathVisibleState = atom<boolean>({
  key: prefixer('okrPathVisible'),
  default: DEFAULT_OKR_PATH_VISIBLE,
});

/**
 * OKR List 右侧详细列表 visible
 */
export const okrListVisibleBaseState = atom<boolean>({
  key: prefixer('okrListVisibleBase'),
  default: DEFAULT_OKR_List_VISIBLE,
});

export const okrListVisibleState = selector({
  key: prefixer('okrListVisible'),
  get: ({ get }) => {
    // can only visible with okrPath
    if (!get(okrPathVisibleState)) {
      return false;
    }

    return get(okrListVisibleBaseState);
  },
});
