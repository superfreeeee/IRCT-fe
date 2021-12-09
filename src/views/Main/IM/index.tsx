import classNames from 'classnames';
import React, { MouseEventHandler, useEffect, useState } from 'react';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import StatusPoint, { UserState } from '@components/StatusPoint';
import Menu from './Menu';
import { MenuData } from './Menu/type';
import { Container, SearchBar, UserInfo } from './styles';
import FooterNav from './FooterNav';
import Tabs, { TabOption } from './Tabs';

const useTab = (): [TabOption, (option: TabOption) => void] => {
  const [tab, setTab] = useState(TabOption.Team);

  const onTabClick = (option: TabOption) => {
    setTab(option);
  };

  // TODO console
  useEffect(() => {
    console.log(`[IM] tab = ${tab}`);
  }, [tab]);

  return [tab, onTabClick];
};

const fakeList: MenuData[] = [
  { title: 'Joe Zhao', state: UserState.Idle, pinned: true },
  {
    title: 'Tingting',
    state: UserState.Work,
    usingApp: 'Notion',
    pinned: true,
  },
  { title: 'Doc PM Group', pinned: true, unread: 31 },
  { title: 'CC 0', state: UserState.Busy, usingApp: 'figma' },
  { title: 'Project Beta Group' },
  { title: 'Project Alpha Group' },
  { title: 'Project Alpha Group LongLongLongLongNmae' },
  { title: 'Naiquan Gu', state: UserState.Busy, unread: 3 },
  { title: 'Hang Yu', state: UserState.Busy, usingApp: 'Pycharm' },
  { title: 'Shuting Tang', state: UserState.Work, usingApp: 'Notion' },
];

const IM = () => {
  const [tab, onTabClick] = useTab();
  const [list, setList] = useState(fakeList);

  return (
    <Container>
      <UserInfo>
        <div className="selection">
          <BoxIcon type={BoxIconType.ExpandVertical} />
          <span>Alibaba Dingtalk</span>
        </div>
        <div className="avatar">
          <StatusPoint style={{ right: 2, bottom: 2 }} state={UserState.Idle} />
        </div>
      </UserInfo>
      <SearchBar>
        <div className="input">
          <BoxIcon type={BoxIconType.Search} />
          <input placeholder="Search for people or room" type="text" />
        </div>
        <BoxIcon type={BoxIconType.Setting} size={'sm'} />
      </SearchBar>
      <Tabs current={tab} onTabClick={onTabClick} />
      <Menu list={list}></Menu>
      <FooterNav />
    </Container>
  );
};

export default IM;
