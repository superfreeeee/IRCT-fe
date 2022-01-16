import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';

import { switchSpaceAction } from '@store/reducers/space';
import { TeamData } from '@store/reducers/team';
import {
  selectedRoomIdState,
  selectedTeamIdState,
  TabOption,
} from '@views/Main/state/im';
import { MenuData } from './Menu/type';
import { currentTabState } from '../state/im';
import { teamDataListState } from '../state/team';
import { roomDataListState } from '../state/room';

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
  // 当前选中 Team/Room Id
  const [selectedTeamId, setSelectedTeamId] =
    useRecoilState(selectedTeamIdState);
  const [selectedRoomId] = useRecoilState(selectedRoomIdState);

  // Team/Room 列表
  const teamDataList = useRecoilValue(teamDataListState);
  const roomDataList = useRecoilValue(roomDataListState);

  // 当前 tab
  const currentTab = useRecoilValue(currentTabState);

  const isRoom = currentTab === TabOption.Room;

  const menuList = useMemo(() => {
    return isRoom ? roomDataList : teamDataList;
  }, [currentTab, teamDataList, roomDataList]);

  const selected = useMemo(() => {
    return isRoom ? selectedRoomId : selectedTeamId;
  }, [currentTab, selectedTeamId, selectedRoomId]);

  const dispatch = useDispatch();
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
