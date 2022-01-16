import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import { RoomData } from '@views/Main/state/room';
import { TeamData } from '@views/Main/state/team';
import { currentTabState, TabOption } from '@views/Main/state/im';
import Item, { ItemProps } from './Item';
import { MenuContainer, MenuSepContainer } from './styles';
import { ItemExtraData, MenuData } from './type';
import { useRecoilValue } from 'recoil';
import { currentUserTeamDataState } from '@views/Main/state/user';

/**
 * IM - Menu 列表
 *   Team 联络人列表
 *   Room 仿真空间列表
 * @param param0
 * @returns
 */
interface MenuProps {
  list: MenuData[];
  selected: string;
  onItemClick: (data: MenuData) => void;
}

const Menu: FC<MenuProps> & { Item: FC<ItemProps> } = ({
  list,
  selected,
  onItemClick,
}) => {
  const currentTab = useRecoilValue(currentTabState);

  const isRoom = currentTab === TabOption.Room;

  const currentUser = useRecoilValue(currentUserTeamDataState);
  const space = useSelector((state: AppState) => state.space);
  const subtitleMap: { [id: string]: ItemExtraData } = useMemo(() => {
    if (isRoom) {
      // extraData for Room
      const mapper: { [id: string]: ItemExtraData } = {};

      const simulationSpaces = space.simulationSpaces;
      (list as RoomData[]).forEach(({ id: roomId }) => {
        const spaceObj = simulationSpaces[roomId];
        const members = spaceObj ? spaceObj.figures.length : 0;
        mapper[roomId] = {
          subtitle: members
            ? `${spaceObj.figures.length} people here`
            : 'empty',
          members,
        };
      }, mapper);

      return mapper;
    } else {
      // extraData for Team
      const mapper: { [id: string]: ItemExtraData } = {};

      const userNameMapper = {};
      const getUserName = (userId: string) => {
        if (userId in userNameMapper) {
          return userNameMapper[userId];
        }
        if (userId === currentUser.id) {
          return (userNameMapper[userId] = currentUser.name);
        }
        const userName = (list as TeamData[]).filter(
          (user) => user.id === userId,
        )[0]?.name;
        if (userName) {
          return (userNameMapper[userId] = userName);
        }
      };

      const teamChats = space.teamChat;
      (list as TeamData[]).forEach(({ id: teamId, state }) => {
        const isGroup = !state;
        const records = teamChats[teamId];
        if (records) {
          const { userId, text, createTime } = records[records.length - 1];

          mapper[teamId] = {
            subtitle: isGroup ? `${getUserName(userId)}: ${text}` : text,
            lastRecordTime: createTime,
          };
        }
      });

      return mapper;
    }
  }, [list, isRoom, space]);

  return (
    <MenuContainer>
      <MenuSepContainer>
        {list.map((data) => {
          return (
            <Item
              key={data.id}
              currentTab={currentTab}
              selected={selected === data.id}
              data={data}
              extraData={subtitleMap[data.id]}
              onSelect={onItemClick}
            ></Item>
          );
        })}
      </MenuSepContainer>
    </MenuContainer>
  );
};

Menu.Item = Item;

export default Menu;
