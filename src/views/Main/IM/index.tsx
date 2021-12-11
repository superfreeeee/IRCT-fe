import React, { useEffect, useMemo } from 'react';
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
import { TabOption } from './type';
import { IMContainer, SearchBar, UserInfo } from './styles';
import { useTab, useHidePage } from './hooks';

const IM = () => {
  const userInfo = useSelector((state: AppState) => state.user);
  const team = useSelector((state: AppState) => state.team);
  const room = useSelector((state: AppState) => state.room);

  const [tab, onTabClick] = useTab();

  const menuList = useMemo(() => {
    switch (tab) {
      case TabOption.Room:
        return room.list;
      case TabOption.Team:
        return team.list;
    }
  }, [tab, team.list, room.list]);

  const { org, state: userState } = userInfo;

  // TODO clear console
  useEffect(() => {
    console.log('[IM] userInfo', userInfo);
  }, [userInfo]);
  // TODO clear console
  useEffect(() => {
    console.log('[IM] team', team);
    console.log('[IM] team.list', team.list);
  }, [team]);
  // TODO clear console
  useEffect(() => {
    console.log('[IM] room', room);
    console.log('[IM] room.list', room.list);
  }, [room]);

  const [spaceVisible, toggleSpaceVisible] = useHidePage();

  return (
    <IMContainer>
      <UserInfo>
        <div className="selection">
          <BoxIcon type={BoxIconType.ExpandVertical} />
          <span>{org}</span>
        </div>
        <Avatar usage={AvatarUsage.IMUserInfo}>
          <StatusPoint style={{ right: 2, bottom: 2 }} state={userState} />
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
      <Menu list={menuList}></Menu>
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
