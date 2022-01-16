import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import {
  switchSpaceAction,
  toggleSpaceVisibleAction,
} from '@store/reducers/space';
import { TeamData } from '@store/reducers/team';
import {
  selectedRoomIdState,
  selectedTeamIdState,
  TabOption,
} from '@views/Main/state/im';
import { MenuData } from './Menu/type';
import { currentTabState } from '../state/im';

/**
 * Tabs
 * @returns
 */
export const useTab = (): [TabOption, (option: TabOption) => void] => {
  const [tab, setTab] = useRecoilState(currentTabState);

  const dispatch = useDispatch();
  // 初始化
  useEffect(() => {
    const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
    switchSpace(tab);
  }, []);

  const selectedTeamId = useRecoilValue(selectedTeamIdState);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  // const selectedTeam = useSelector((state: AppState) => state.team.selected);
  // const selectedRoomId = useSelector((state: AppState) => state.room.selected);

  const onTabClick = useCallback(
    (option: TabOption) => {
      setTab(option);

      const selectedId =
        option === TabOption.Team ? selectedTeamId : selectedRoomId;
      if (selectedId) {
        const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
        switchSpace(option);
      }
    },
    [selectedTeamId, selectedRoomId],
  );

  return [tab, onTabClick];
};

/**
 * 列表用数据
 */
export const useMenu = () => {
  const team = useSelector((state: AppState) => state.team);
  const room = useSelector((state: AppState) => state.room);

  const currentTab = useRecoilValue(currentTabState);

  const isRoom = currentTab === TabOption.Room;

  const menuList = useMemo(() => {
    return isRoom ? room.list : team.list;
  }, [currentTab, team.list, room.list]);

  const selected = useMemo(() => {
    return isRoom ? room.selected : team.selected;
  }, [currentTab, team.selected, room.selected]);

  const dispatch = useDispatch();
  const setSelectedTeamId = useSetRecoilState(selectedTeamIdState);
  /**
   * 点击目录切换
   */
  const onItemClick = useMemo(() => {
    const switchSpace = bindActionCreators(switchSpaceAction, dispatch);

    //  spaceId: string
    return (data: MenuData) => {
      const { id: spaceId } = data;
      if (currentTab === TabOption.Team) {
        if (spaceId === selected) {
          setSelectedTeamId('');
        } else {
          setSelectedTeamId((data as TeamData).id);
        }
        switchSpace(currentTab);
      }
    };
  }, [currentTab, selected]);

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
    dispatch,
  );

  return [visible, toggleSpaceVisible];
};
