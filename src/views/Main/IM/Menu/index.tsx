import React, { FC, useMemo } from 'react';

import Item, { ItemProps } from './components/Item';
import Tooltip from './components/Tooltip';
import { MenuContainer, MenuSepContainer } from './styles';
import { useTooltip } from './hooks';
import { ItemExtraData, MenuData } from './type';
import { TabOption } from '../type';
import { useSelector } from 'react-redux';
import { AppState } from '@store/reducers';
import { RoomData } from '@store/reducers/room';
import useLog from '@hooks/useLog';
import { TeamData } from '@store/reducers/team';

/**
 * IM - Menu 列表
 *   Team 联络人列表
 *   Room 仿真空间列表
 * @param param0
 * @returns
 */
interface MenuProps {
  currentTab: TabOption;
  list: MenuData[];
  selected: string;
  onItemClick: (data: MenuData) => void;
}

const Menu: FC<MenuProps> & { Item: FC<ItemProps> } = ({
  currentTab,
  list,
  selected,
  onItemClick,
}) => {
  const [tooltipState, { showTooltip, closeTooltip }] = useTooltip();

  const isRoom = currentTab === TabOption.Room;

  const user = useSelector((state: AppState) => state.user);
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
        if (userId === user.id) {
          return (userNameMapper[userId] = user.name);
        }
        const userName = list.filter((user) => user.id === userId)[0]?.title;
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
              showTooltip={showTooltip}
              closeTooltip={closeTooltip}
              onSelect={onItemClick}
            ></Item>
          );
        })}
      </MenuSepContainer>
      {/* hover 文字 */}
      <Tooltip state={tooltipState} />
    </MenuContainer>
  );
};

Menu.Item = Item;

export default Menu;
