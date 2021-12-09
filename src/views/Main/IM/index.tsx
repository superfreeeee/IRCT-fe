import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import StatusPoint from '@components/StatusPoint';
import { AppState } from '@store/reducers';

import Menu from './Menu';
import FooterNav from './FooterNav';
import Tabs, { TabOption } from './Tabs';
import { Container, SearchBar, UserInfo } from './styles';

const useTab = (): [TabOption, (option: TabOption) => void] => {
  const [tab, setTab] = useState(TabOption.Team);

  const onTabClick = (option: TabOption) => {
    setTab(option);
  };

  // TODO clear console
  useEffect(() => {
    console.log(`[IM] tab = ${tab}`);
  }, [tab]);

  return [tab, onTabClick];
};

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

  return (
    <Container>
      <UserInfo>
        <div className="selection">
          <BoxIcon type={BoxIconType.ExpandVertical} />
          <span>{org}</span>
        </div>
        <div className="avatar">
          <StatusPoint style={{ right: 2, bottom: 2 }} state={userState} />
        </div>
      </UserInfo>
      <SearchBar>
        <div className="input">
          <BoxIcon type={BoxIconType.Search} />
          <input placeholder="Search for people or room" type="text" />
        </div>
        <BoxIcon type={BoxIconType.Setting} size={'sm'} clickable />
      </SearchBar>
      <Tabs current={tab} onTabClick={onTabClick} />
      <Menu list={menuList}></Menu>
      <FooterNav />
    </Container>
  );
};

export default IM;
