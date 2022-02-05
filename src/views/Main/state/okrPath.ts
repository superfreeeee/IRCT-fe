import { atom, selector } from 'recoil';
import { PathNode } from '../OKRPath/PathBoard/type';

import {
  DEFAULT_OKR_LIST_EXPAND_BTN_POSITION,
  DEFAULT_OKR_LIST_EXPAND_BTN_VISIBLE,
  DEFAULT_OKR_PATH_LIST_VISIBLE,
  DEFAULT_OKR_PATH_TOOLTIP_POSITION,
  DEFAULT_OKR_PATH_TOOLTIP_VISIBLE,
  DEFAULT_OKR_PATH_VISIBLE,
  DEFAULT_OKR_VIEW_POINT_CENTER_USER_ID,
  DEFAULT_OKR_VIEW_POINT_TYPE,
} from './defaults';
import { CEO_ID } from './okrDB/db';
import { ViewPointType } from './okrDB/type';
import {
  ExpandBtnPosition,
  PathTooltipPosition,
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
const okrPathListVisibleBaseState = atom<boolean>({
  key: prefixer('okrPathListVisibleBase'),
  default: DEFAULT_OKR_PATH_LIST_VISIBLE,
});
export const okrPathListVisibleState = selector<boolean>({
  key: prefixer('okrPathListVisible'),
  get: ({ get }) => {
    // can only visible when
    //   okrPath visible
    //   in personal viewpoint
    const pathVisible = get(okrPathVisibleState);
    const isPersonalViewPoint =
      get(viewPointTypeState) === ViewPointType.Personal;
    const listVisible = get(okrPathListVisibleBaseState);
    return pathVisible && isPersonalViewPoint && listVisible;
  },
  set: ({ set }, visible) => {
    set(okrPathListVisibleBaseState, visible);
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
  set: ({ set }, type) => {
    set(viewPointTypeBaseState, type);

    // 切换回组织视图时关闭 List
    if (type === ViewPointType.Organization) {
      set(okrPathListVisibleState, false);
    }
  },
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
  set: ({ set }, userId) => set(viewPointCenterUserIdBaseState, userId),
});

/**
 * 视图观察记录栈
 */
const viewPointStackBaseState = atom<ViewPointRecord[]>({
  key: prefixer('viewPointStackBase'),
  default: [],
});
export const viewPointStackState = selector<ViewPointRecord[]>({
  key: prefixer('viewPointStack'),
  get: ({ get }) => get(viewPointStackBaseState),
  set: ({ set }, stack) => set(viewPointStackBaseState, stack),
});

/**
 * 更新视图观察记录
 */
export const viewPointStackUpdater = selector<ViewPointStackAction>({
  key: prefixer('viewPointStackUpdater'),
  get: ({ get }) => {
    console.warn('try get viewPointStackUpdater');
    const records = get(viewPointStackBaseState);
    return { type: ViewPointStackActionType.Null, record: records[0] };
  },
  set: ({ get, set }, action: ViewPointStackAction) => {
    let records: ViewPointRecord[], type: ViewPointType, centerUserId: string;
    switch (action.type) {
      // 清空记录 => 清空栈记录 & 重置为组织视图
      case ViewPointStackActionType.Clear:
        set(viewPointStackBaseState, []);
        set(viewPointTypeState, ViewPointType.Organization);
        set(viewPointCenterUserIdState, '');
        break;

      // 弹出一项纪录
      case ViewPointStackActionType.Pop:
        records = get(viewPointStackBaseState);
        records = records.slice(0, records.length - 1);
        set(viewPointStackBaseState, records);

        if (records.length > 0) {
          ({ type, centerUserId } = records[records.length - 1]);
          set(viewPointTypeState, type);
          set(viewPointCenterUserIdState, centerUserId || '');
        } else {
          set(viewPointTypeState, ViewPointType.Organization);
          set(viewPointCenterUserIdState, '');
        }
        break;

      // 推入一项纪录
      case ViewPointStackActionType.Push:
        records = get(viewPointStackBaseState);

        ({ type, centerUserId } = action.record);
        records = [...records, { type, centerUserId }];

        set(viewPointStackBaseState, records);
        set(viewPointTypeState, type);
        set(viewPointCenterUserIdState, centerUserId);
        break;
    }
  },
});

// =============== Node tooltip ===============
/**
 * tooltip 位置信息
 */
export const tooltipPositionState = atom<PathTooltipPosition>({
  key: prefixer('tooltipPosition'),
  default: DEFAULT_OKR_PATH_TOOLTIP_POSITION,
});

/**
 * tooltip 可见性
 */
const tooltipVisibleBaseState = atom<boolean>({
  key: prefixer('tooltipVisibleBase'),
  default: DEFAULT_OKR_PATH_TOOLTIP_VISIBLE,
});
export const tooltipVisibleState = selector<boolean>({
  key: prefixer('tooltipVisible'),
  get: ({ get }) => {
    const selectNode = get(tooltipDataState);
    const visibleBase = get(tooltipVisibleBaseState);
    return selectNode && visibleBase;
  },
  set: ({ set }, visible) => set(tooltipVisibleBaseState, visible),
});

/**
 * 展示内容
 */
export const tooltipDataState = atom<PathNode>({
  key: prefixer('tooltipData'),
  default: null,
});

// =============== List Expand button ===============
/**
 * visible
 */
const expandBtnVisibleBaseState = atom<boolean>({
  key: prefixer('expandBtnVisibleBase'),
  default: DEFAULT_OKR_LIST_EXPAND_BTN_VISIBLE,
});
export const expandBtnVisibleState = selector<boolean>({
  key: prefixer('expandBtnVisible'),
  get: ({ get }) => {
    const listVisible = get(okrPathListVisibleState);
    const visible = get(expandBtnVisibleBaseState);

    // visible when list is visible
    return listVisible && visible;
  },
  set: ({ set }, visible) => set(expandBtnVisibleBaseState, visible),
});

/**
 * position
 */
const expandBtnPositionBaseState = atom<ExpandBtnPosition>({
  key: prefixer('expandBtnPositionBase'),
  default: DEFAULT_OKR_LIST_EXPAND_BTN_POSITION,
});
export const expandBtnPositionState = selector<ExpandBtnPosition>({
  key: prefixer('expandBtnPosition'),
  get: ({ get }) => get(expandBtnPositionBaseState),
  set: ({ set }, position) => set(expandBtnPositionBaseState, position),
});

/**
 * isOpen
 */
const expandBtnIsOpenBaseState = atom<boolean>({
  key: prefixer('expandBtnIsOpenBase'),
  default: false,
});
export const expandBtnIsOpenState = selector<boolean>({
  key: prefixer('expandBtnIsOpen'),
  get: ({ get }) => get(expandBtnIsOpenBaseState),
  set: ({ set }, isOpen) => set(expandBtnIsOpenBaseState, isOpen),
});
