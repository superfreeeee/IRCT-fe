import { useCallback, useEffect, useMemo, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import {
  switchSpaceAction,
  toggleSpaceVisibleAction,
} from '@store/reducers/space';
import { TabOption } from './type';
import { enterRoomAction, exitRoomAction } from '@store/reducers/room';
import { enterTeamAction, exitTeamAction } from '@store/reducers/team';

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
      // tab 同步到 space/currentSpace
      switchSpace(option);
    },
    [switchSpace]
  );

  return [tab, onTabClick];
};

/**
 * 列表用数据
 * @param tab
 * @returns
 */
export const useMenu = (tab: TabOption) => {
  const team = useSelector((state: AppState) => state.team);
  const room = useSelector((state: AppState) => state.room);

  const isRoom = tab === TabOption.Room;

  const menuList = useMemo(() => {
    return isRoom ? room.list : team.list;
  }, [tab, team.list, room.list]);

  const selected = useMemo(() => {
    return isRoom ? room.selected : team.selected;
  }, [tab, team.selected, room.selected]);

  const dispatch = useDispatch();

  const onItemClick = useMemo(() => {
    const enterRoom = bindActionCreators(enterRoomAction, dispatch);
    const exitRoom = bindActionCreators(exitRoomAction, dispatch);
    const enterTeam = bindActionCreators(enterTeamAction, dispatch);
    const exitTeam = bindActionCreators(exitTeamAction, dispatch);

    const options = {
      [TabOption.Room]: {
        enter: enterRoom,
        exit: exitRoom,
      },
      [TabOption.Team]: {
        enter: enterTeam,
        exit: exitTeam,
      },
    };

    return (spaceId: string) => {
      if (spaceId === selected) {
        console.log('exit');
        options[tab].exit();
      } else {
        console.log('enter');
        options[tab].enter(spaceId);
      }
    };
  }, [tab, selected]);

  return {
    menuList,
    selected,
    onItemClick,
  };
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
