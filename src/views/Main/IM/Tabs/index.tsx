import classNames from 'classnames';
import React, { FC } from 'react';

import { currentTabState, TabOption } from '@views/Main/state/im';
import { Tab, TabsContainer } from './styles';
import { useRecoilValue } from 'recoil';

const options = [TabOption.Team, TabOption.Room];

interface TabsProps {
  onTabClick: (option: TabOption) => void;
}

const Tabs: FC<TabsProps> = ({ onTabClick }) => {
  const currentTab = useRecoilValue(currentTabState);

  return (
    <TabsContainer>
      {options.map((option) => (
        <Tab
          key={option}
          onClick={() => onTabClick(option)}
          className={classNames({ active: currentTab === option })}
          value={option}
        >
          <span>{option}</span>
        </Tab>
      ))}
    </TabsContainer>
  );
};

export default Tabs;
