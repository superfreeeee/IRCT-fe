import classNames from 'classnames';
import React, { FC } from 'react';

import { Tab, TabsContainer } from './styles';

export enum TabOption {
  Room = 'Room',
  Team = 'Team',
}

const options = [TabOption.Room, TabOption.Team];

interface TabsProps {
  current: TabOption;
  onTabClick: (option: TabOption) => void;
}

const Tabs: FC<TabsProps> = ({ current, onTabClick }) => {
  return (
    <TabsContainer>
      {options.map((option) => (
        <Tab
          key={option}
          onClick={() => onTabClick(option)}
          className={classNames({ active: current === option })}
          value={option}
        >
          {option}
        </Tab>
      ))}
    </TabsContainer>
  );
};

export default Tabs;
