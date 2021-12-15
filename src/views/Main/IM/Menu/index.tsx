import React, { FC } from 'react';

import Item, { ItemProps } from './components/Item';
import Tooltip from './components/Tooltip';
import { Container, MenuSepContainer, MenuSepTag } from './styles';
import { useTooltip } from './hooks';
import { MenuData } from './type';

/**
 * 列表分区（置顶/其他）
 */
interface MenuSepProps {
  selected: string;
  list: MenuData[];
  showTooltip: (content: string, position) => void;
  closeTooltip: () => void;
  onSelect: (id: string) => void;
}

const MenuSep: FC<MenuSepProps> = ({
  selected,
  list,
  showTooltip,
  closeTooltip,
  onSelect,
}) => {
  return (
    <MenuSepContainer>
      {list.map((data) => {
        return (
          <Item
            key={data.id}
            selected={selected === data.id}
            data={data}
            showTooltip={showTooltip}
            closeTooltip={closeTooltip}
            onSelect={onSelect}
          ></Item>
        );
      })}
    </MenuSepContainer>
  );
};

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
  onItemClick: (id: string) => void;
}

const Menu: FC<MenuProps> & { Item: FC<ItemProps> } = ({
  list,
  selected,
  onItemClick,
}) => {
  const pinnedList = list.filter((data) => data.pinned);
  const otherList = list.filter((data) => !data.pinned);

  const noPinned = !pinnedList.length;

  const [tooltipState, { showTooltip, closeTooltip }] = useTooltip();

  return (
    <Container>
      {!noPinned && (
        <>
          <MenuSepTag>置顶</MenuSepTag>
          {/* 置顶列表 */}
          <MenuSep
            selected={selected}
            list={pinnedList}
            showTooltip={showTooltip}
            closeTooltip={closeTooltip}
            onSelect={onItemClick}
          />
          <MenuSepTag>其他</MenuSepTag>
        </>
      )}
      {/* 其他列表 */}
      <MenuSep
        selected={selected}
        list={otherList}
        showTooltip={showTooltip}
        closeTooltip={closeTooltip}
        onSelect={onItemClick}
      />
      {/* hover 文字 */}
      <Tooltip state={tooltipState} />
    </Container>
  );
};

Menu.Item = Item;

export default Menu;
