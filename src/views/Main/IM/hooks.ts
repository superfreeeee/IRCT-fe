import { useCallback, useEffect, useMemo, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import {
  switchSpaceAction,
  toggleSpaceVisibleAction,
} from '@store/reducers/space';
import { enterRoomAction, RoomData } from '@store/reducers/room';
import {
  enterTeamAction,
  exitTeamAction,
  TeamData,
} from '@store/reducers/team';
import { TabOption } from './type';
import { DEFAULT_TAB } from './config';
import { MenuData } from './Menu/type';

/**
 * Tabs
 * @returns
 */
export const useTab = (): [TabOption, (option: TabOption) => void] => {
  const [tab, setTab] = useState(DEFAULT_TAB);

  const dispatch = useDispatch();
  // 初始化
  useEffect(() => {
    const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
    switchSpace(tab);
  }, []);

  const selectedTeam = useSelector((state: AppState) => state.team.selected);
  const selectedRoom = useSelector((state: AppState) => state.room.selected);

  const onTabClick = useCallback(
    (option: TabOption) => {
      setTab(option);
      const newTabSelected =
        option === TabOption.Team ? selectedTeam : selectedRoom;
      // TODO clear console
      // console.log(`[useTab.onTabClick] ${option}, selected: ${newTabSelected}`);
      if (newTabSelected) {
        const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
        switchSpace(option);
      }
    },
    [selectedTeam, selectedRoom]
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
  /**
   * 点击目录切换
   */
  const onItemClick = useMemo(() => {
    const enterRoom = bindActionCreators(enterRoomAction, dispatch);
    const enterTeam = bindActionCreators(enterTeamAction, dispatch);
    const exitTeam = bindActionCreators(exitTeamAction, dispatch);
    const switchSpace = bindActionCreators(switchSpaceAction, dispatch);

    //  spaceId: string
    return (data: MenuData) => {
      const { id: spaceId } = data;
      if (spaceId !== selected) {
        // select other roomSpace/teamChat
        if (tab === TabOption.Room) {
          enterRoom(data as RoomData);
        } else {
          enterTeam(data as TeamData);
        }
        switchSpace(tab);
      } else if (tab === TabOption.Team) {
        exitTeam();
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
