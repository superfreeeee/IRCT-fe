import { useCallback, useEffect, useMemo, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import {
  switchSpaceAction,
  toggleSpaceVisibleAction,
} from '@store/reducers/space';
import { TabOption } from './type';

/**
 * Tabs
 * @returns
 */
export const useTab = (): [TabOption, (option: TabOption) => void] => {
  const [tab, setTab] = useState(TabOption.Team);

  const dispatch = useDispatch();
  const switchSpace = useMemo(
    () => bindActionCreators(switchSpaceAction, dispatch),
    [dispatch]
  );

  // 初始化
  useEffect(() => {
    switchSpace(tab);
  }, []);

  const onTabClick = useCallback(
    (option: TabOption) => {
      setTab(option);
      switchSpace(option);
    },
    [switchSpace]
  );

  // TODO clear console
  useEffect(() => {
    console.log(`[IM] tab = ${tab}`);
  }, [tab]);

  return [tab, onTabClick];
};

/**
 * 隐藏 RoomSpace 按钮
 * @returns
 */
export const useHidePage = (): [boolean, () => void] => {
  const { visible } = useSelector((state: AppState) => state.space);

  const dispatch = useDispatch();
  const toggleSpaceVisible = bindActionCreators(
    toggleSpaceVisibleAction,
    dispatch
  );

  return [visible, toggleSpaceVisible];
};
