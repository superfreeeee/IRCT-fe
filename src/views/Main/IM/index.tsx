import React from 'react';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import HidePage from '@components/HidePage';
import Menu from './Menu';
import FooterNav from './FooterNav';
import Tabs from './Tabs';
import { useTab, useHidePage, useMenu } from './hooks';
import { IMContainer, SearchBar } from './styles';

const IM = () => {
  const [tab, onTabClick] = useTab();
  const { menuList, selected, onItemClick } = useMenu(tab);
  const [spaceVisible, toggleSpaceVisible] = useHidePage();

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
      {/* <HidePage
        position={{ left: 266, top: 60 }}
        revert={!spaceVisible}
        onClick={toggleSpaceVisible}
      /> */}
    </IMContainer>
  );
};

export default IM;
