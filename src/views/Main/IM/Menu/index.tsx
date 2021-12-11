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
  list: MenuData[];
  showTooltip: (content: string, position) => void;
  closeTooltip: () => void;
}

const MenuSep: FC<MenuSepProps> = ({ list, showTooltip, closeTooltip }) => {
  return (
    <MenuSepContainer>
      {list.map((data) => {
        return (
          <Item
            key={`${data.title}-${data.pinned}`}
            data={data}
            showTooltip={showTooltip}
            closeTooltip={closeTooltip}
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
}

const Menu: FC<MenuProps> & { Item: FC<ItemProps> } = ({ list }) => {
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
            list={pinnedList}
            showTooltip={showTooltip}
            closeTooltip={closeTooltip}
          />
          <MenuSepTag>其他</MenuSepTag>
        </>
      )}
      {/* 其他列表 */}
      <MenuSep
        list={otherList}
        showTooltip={showTooltip}
        closeTooltip={closeTooltip}
      />
      {/* hover 文字 */}
      <Tooltip state={tooltipState} />
    </Container>
  );
};

Menu.Item = Item;

export default Menu;
