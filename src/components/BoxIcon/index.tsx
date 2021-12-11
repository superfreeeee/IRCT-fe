import classNames from 'classnames';
import React, { FC } from 'react';

import { I } from './styles';

export enum BoxIconType {
  ExpandVertical = 'bx-expand-vertical',
  Setting = 'bx-cog',
  Search = 'bx-search-alt',
  Calender = 'bx-calendar',
  File = 'bx-file',
  Branch = 'bx-git-branch',
  ListCheck = 'bx-list-check',
  LastPage = 'bxs-chevrons-left',
  NextPage = 'bxs-chevrons-right',
}

interface BoxIconProps {
  type: BoxIconType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

const BoxIcon: FC<BoxIconProps> = ({ type, size, clickable = false }) => {
  const sizeStyle = { [`bx-${size}`]: !!size };
  return (
    <I className={classNames('bx', type, sizeStyle)} clickable={clickable}></I>
  );
};

export default BoxIcon;
