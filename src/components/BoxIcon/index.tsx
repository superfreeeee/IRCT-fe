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
  Send = 'bx-send',
  Group = 'bx-group',
  MicroOff = 'bx-microphone-off',
}

interface BoxIconProps {
  type: BoxIconType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
}

const BoxIcon: FC<BoxIconProps> = ({
  type,
  size,
  clickable = false,
  onClick,
}) => {
  const sizeStyle = { [`bx-${size}`]: !!size };
  return (
    <I
      className={classNames('bx', type, sizeStyle)}
      clickable={clickable}
      onClick={onClick}
    />
  );
};

export default BoxIcon;
