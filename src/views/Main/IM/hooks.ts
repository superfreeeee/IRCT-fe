import { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { TabOption } from '@views/Main/state/type';
import { selectedRoomIdState, selectedTeamIdState } from '@views/Main/state/im';
import { MenuData } from './Menu/type';
import { currentTabState } from '../state/im';
import { teamDataListState } from '../state/team';
import { roomDataListState } from '../state/room';
import { currentUserIdState } from '../state/user';
import { currentSpaceIdState } from '../state/roomSpace';
import { okrPathVisibleState } from '../state/okrPath';

/**
 * Tabs
 * @returns
 */
export const useTab = (): [TabOption, (option: TabOption) => void] => {
  const [tab, setTab] = useRecoilState(currentTabState);

  const selectedTeamId = useRecoilValue(selectedTeamIdState);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);

  const onTabClick = useCallback(
    (option: TabOption) => {
      setTab(option);

      const selectedId =
        option === TabOption.Team ? selectedTeamId : selectedRoomId;
      if (selectedId) {
        setCurrentSpaceId(selectedId);
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
  const currentUid = useRecoilValue(currentUserIdState);
  // 当前选中 Team/Room Id
  const [selectedTeamId, setSelectedTeamId] =
    useRecoilState(selectedTeamIdState);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  // Team/Room 列表
  const teamDataList = useRecoilValue(teamDataListState);
  const roomDataList = useRecoilValue(roomDataListState);

  // 当前 tab
  const currentTab = useRecoilValue(currentTabState);

  const isRoom = currentTab === TabOption.Room;

  const menuList = useMemo(() => {
    return isRoom
      ? roomDataList
      : teamDataList.filter((data) => data.id !== currentUid);
  }, [currentTab, teamDataList, roomDataList]);

  const selectedId = useMemo(() => {
    return isRoom ? selectedRoomId : selectedTeamId;
  }, [currentTab, selectedTeamId, selectedRoomId]);

  /**
   * 点击目录切换
   */
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);
  const [okrPathVisible, setOKRPathVisible] =
    useRecoilState(okrPathVisibleState);
  const onItemClick = useCallback(
    (data: MenuData) => {
      if (okrPathVisible) {
        // 点击任意 item 关闭 Path 页面
        setOKRPathVisible(false);
      }

      // 点击 MenuItem 只对 Team 有效
      if (currentTab === TabOption.Team) {
        const { id: teamId } = data;
        if (teamId === selectedId && !okrPathVisible) {
          // okrPath 关闭时再点击才关闭 Team
          setSelectedTeamId('');
          setCurrentSpaceId('');
        } else {
          setSelectedTeamId(teamId);
          setCurrentSpaceId(teamId);
        }
      }
    },
    [currentTab, selectedId, okrPathVisible],
  );

  return {
    menuList,
    selectedId,
    onItemClick,
  };
};
