import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import StatusPoint from '@components/StatusPoint';
import { AppState } from '@store/reducers';
import HidePage from '@components/HidePage';
import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import Menu from './Menu';
import FooterNav from './FooterNav';
import Tabs from './Tabs';
import { IMContainer, SearchBar, UserInfo } from './styles';
import { useTab, useHidePage, useMenu } from './hooks';

const IM = () => {
  const userInfo = useSelector((state: AppState) => state.user);

  const [tab, onTabClick] = useTab();
  const { menuList, selected, onItemClick } = useMenu(tab);
  const [spaceVisible, toggleSpaceVisible] = useHidePage();

  return (
    <IMContainer>
      <UserInfo>
        <div className="selection">
          <BoxIcon type={BoxIconType.ExpandVertical} />
          <span>{userInfo.org}</span>
        </div>
        <Avatar usage={AvatarUsage.IMUserInfo}>
          <StatusPoint style={{ right: 2, bottom: 2 }} state={userInfo.state} />
        </Avatar>
      </UserInfo>
      <SearchBar>
        <label className="input" htmlFor="search">
          <BoxIcon type={BoxIconType.Search} />
          <input
            id="search"
            placeholder="Search for people or room"
            type="text"
          />
        </label>
        <BoxIcon type={BoxIconType.Setting} size={'sm'} clickable />
      </SearchBar>
      <Tabs current={tab} onTabClick={onTabClick} />
      <Menu
        list={menuList}
        selected={selected}
        onItemClick={onItemClick}
      ></Menu>
      <FooterNav />
      <HidePage
        position={{ left: 266, top: 60 }}
        revert={!spaceVisible}
        onClick={toggleSpaceVisible}
      />
    </IMContainer>
  );
};

export default IM;
