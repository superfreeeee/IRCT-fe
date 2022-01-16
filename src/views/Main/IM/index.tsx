import React from 'react';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import Menu from './Menu';
import FooterNav from './FooterNav';
import Tabs from './Tabs';
import { useTab, useMenu } from './hooks';
import { IMContainer, SearchBar } from './styles';
import StateTooltip from './StateTooltip';

const IM = () => {
  const [tab, onTabClick] = useTab();
  const { menuList, selected, onItemClick } = useMenu(tab);

  return (
    <IMContainer>
      <SearchBar>
        <label className="input" htmlFor="search">
          <BoxIcon type={BoxIconType.Search} />
          <input
            id="search"
            placeholder="Search for conversation"
            type="text"
          />
        </label>
      </SearchBar>
      <Tabs current={tab} onTabClick={onTabClick} />
      <Menu
        currentTab={tab}
        list={menuList}
        selected={selected}
        onItemClick={onItemClick}
      ></Menu>
      <FooterNav />
      <StateTooltip />
    </IMContainer>
  );
};

export default IM;
