import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { currentTabState } from '@/views/Main/state/im';
import Item, { ItemProps } from './Item';
import { MenuContainer, MenuSepContainer } from './styles';
import { MenuData } from './type';

/**
 * IM - Menu 列表
 *   Team 联络人列表
 *   Room 仿真空间列表
 * @param param0
 * @returns
 */
interface MenuProps {
  list: MenuData[];
  selectedId: string;
  onItemClick: (data: MenuData) => void;
}

const Menu: FC<MenuProps> & { Item: FC<ItemProps> } = ({
  list,
  selectedId,
  onItemClick,
}) => {
  const currentTab = useRecoilValue(currentTabState);

  return (
    <MenuContainer>
      <MenuSepContainer>
        {list.map((data) => {
          return (
            <Item
              key={data.id}
              currentTab={currentTab}
              selected={selectedId === data.id}
              data={data}
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
