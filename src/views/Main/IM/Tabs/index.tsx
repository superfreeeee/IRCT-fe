import classNames from 'classnames';
import React, { FC } from 'react';

import { Tab, TabsContainer } from './styles';
import { TabOption } from '../type';

const options = [TabOption.Team, TabOption.Room];

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
          <span>{option}</span>
        </Tab>
      ))}
    </TabsContainer>
  );
};

export default Tabs;
