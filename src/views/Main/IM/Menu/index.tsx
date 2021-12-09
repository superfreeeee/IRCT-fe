import StatusPoint from '@components/StatusPoint';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';

import Item, { ItemProps } from './Item';
import { Container, ItemTooltip, MenuSepContainer, MenuSepTag } from './styles';
import Tooltip from './Tooltip';
import { MenuData } from './type';

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

interface MenuProps {
  list: MenuData[];
}

const Menu: FC<MenuProps> & { Item: FC<ItemProps> } = ({ list }) => {
  const pinnedList = list.filter((data) => data.pinned);
  const otherList = list.filter((data) => !data.pinned);

  const noPinned = !pinnedList.length;

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({
    bottom: 0,
    left: 0,
  });

  const showTooltip = (content: string, position) => {
    setTooltipVisible(true);
    setTooltipContent(content);
    setTooltipPosition(position);
  };

  const closeTooltip = () => {
    setTooltipVisible(false);
  };

  useEffect(() => {
    if (tooltipVisible) {
      console.log(`[Menu] tooltipContent = ${tooltipContent}`);
    }
  }, [tooltipVisible]);

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
      <Tooltip>
        <ItemTooltip
          style={{ ...tooltipPosition }}
          className={classNames({ active: tooltipVisible })}
        >
          {tooltipContent}
        </ItemTooltip>
      </Tooltip>
    </Container>
  );
};

Menu.Item = Item;

export default Menu;
