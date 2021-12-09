import classNames from 'classnames';
import React, { FC } from 'react';
import styled from 'styled-components';

export enum BoxIconType {
  ExpandVertical = 'bx-expand-vertical',
  Setting = 'bx-cog',
  Search = 'bx-search-alt',
  Calender = 'bx-calendar',
  File = 'bx-file',
  Branch = 'bx-git-branch',
  ListCheck = 'bx-list-check',
}

interface BoxIconProps {
  type: BoxIconType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const I = styled.i`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoxIcon: FC<BoxIconProps> = ({ type, size }) => {
  const sizeStyle = { [`bx-${size}`]: !!size };
  return <I className={classNames('bx', type, sizeStyle)}></I>;
};

export default BoxIcon;
