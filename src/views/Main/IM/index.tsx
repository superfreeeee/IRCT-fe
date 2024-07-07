import React from 'react';

import BoxIcon, { BoxIconType } from '@/components/BoxIcon';
import Menu from './Menu';
import FooterNav from './FooterNav';
import Tabs from './Tabs';
import { useTab, useMenu } from './hooks';
import { IMContainer, SearchBar } from './styles';
import StateTooltip from './StateTooltip';

const IM = () => {
  const [tab, onTabClick] = useTab();
  const { menuList, selectedId, onItemClick } = useMenu();

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
      <Tabs onTabClick={onTabClick} />
      <Menu
        list={menuList}
        selectedId={selectedId}
        onItemClick={onItemClick}
      ></Menu>
      <FooterNav />
      <StateTooltip />
    </IMContainer>
  );
};

export default IM;
