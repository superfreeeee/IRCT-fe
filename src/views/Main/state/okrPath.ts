import { atom, selector } from 'recoil';

import {
  DEFAULT_OKR_PATH_LIST_VISIBLE,
  DEFAULT_OKR_PATH_VISIBLE,
  DEFAULT_OKR_VIEW_POINT_CENTER_USER_ID,
  DEFAULT_OKR_VIEW_POINT_TYPE,
} from './defaults';
import { CEO_ID } from './okrDB/db';
import { ViewPointType } from './okrDB/type';
import {
  StateNamespace,
  ViewPointRecord,
  ViewPointStackAction,
  ViewPointStackActionType,
} from './type';
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
export const okrPathListVisibleBaseState = atom<boolean>({
  key: prefixer('okrPathListVisibleBase'),
  default: DEFAULT_OKR_PATH_LIST_VISIBLE,
});
export const okrPathListVisibleState = selector<boolean>({
  key: prefixer('okrPathListVisible'),
  get: ({ get }) => {
    // can only visible with okrPath
    // and in personal viewpoint
    const pathVisible = get(okrPathVisibleState);
    const isPersonalViewPoint = get(viewPointTypeState);
    const listVisible = get(okrPathListVisibleBaseState);
    return pathVisible && isPersonalViewPoint && listVisible;
  },
});

/**
 * 当前视图类型
 */
const viewPointTypeBaseState = atom<ViewPointType>({
  key: prefixer('viewPointTypeBase'),
  default: DEFAULT_OKR_VIEW_POINT_TYPE,
});
export const viewPointTypeState = selector<ViewPointType>({
  key: prefixer('viewPointType'),
  get: ({ get }) => get(viewPointTypeBaseState),
});

/**
 * 视图中央人物
 *   组织视图 => CEO = user-666
 */
const viewPointCenterUserIdBaseState = atom<string>({
  key: prefixer('viewPointCenterUserIdBase'),
  default: DEFAULT_OKR_VIEW_POINT_CENTER_USER_ID,
});
export const viewPointCenterUserIdState = selector<string>({
  key: prefixer('viewPointCenterUserId'),
  get: ({ get }) => {
    const type = get(viewPointTypeState);
    if (type === ViewPointType.Organization) {
      return CEO_ID;
    } else {
      return get(viewPointCenterUserIdBaseState);
    }
  },
});

/**
 * 视图观察记录栈
 */
const viewPointStackBaseState = atom<ViewPointRecord[]>({
  key: prefixer('viewPointStackBase'),
  default: [],
});
export const viewPointStackState = selector({
  key: prefixer('viewPointStack'),
  get: ({ get }) => get(viewPointStackBaseState),
});

/**
 * 更新视图观察记录
 */
export const viewPointStackUpdater = selector<ViewPointStackAction>({
  key: prefixer('viewPointStackUpdater'),
  get: () => {
    console.warn('try get viewPointStackUpdater');
    return { type: ViewPointStackActionType.Null };
  },
  set: ({ get, set }, action: ViewPointStackAction) => {
    let records: ViewPointRecord[], type: ViewPointType, centerUserId: string;
    switch (action.type) {
      // 清空记录 => 清空栈记录 & 重置为组织视图
      case ViewPointStackActionType.Clear:
        set(viewPointStackBaseState, []);
        set(viewPointTypeBaseState, ViewPointType.Organization);
        set(viewPointCenterUserIdBaseState, '');
        break;

      // 弹出一项纪录
      case ViewPointStackActionType.Pop:
        records = get(viewPointStackBaseState).slice();
        console.log(`records`, [...records]);

        records.pop();
        console.log(`records after pop`, records);

        if (records.length > 0) {
          ({ type, centerUserId } = records[records.length - 1]);
          set(viewPointStackBaseState, records);
          set(viewPointTypeBaseState, type);
          set(viewPointCenterUserIdBaseState, centerUserId || '');
        } else {
          set(viewPointTypeBaseState, ViewPointType.Organization);
          set(viewPointCenterUserIdBaseState, '');
        }
        break;

      // 推入一项纪录
      case ViewPointStackActionType.Push:
        records = get(viewPointStackBaseState).slice();
        console.log(`records`, [...records]);

        ({ type, centerUserId } = action.record);
        records = [...records, { type, centerUserId }];
        console.log(`records after push`, [...records]);

        set(viewPointStackBaseState, records);
        set(viewPointTypeBaseState, type);
        set(viewPointCenterUserIdBaseState, centerUserId);
        break;
    }
  },
});
