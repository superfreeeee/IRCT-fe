import React from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import styled from 'styled-components';

import {
  expandBtnIsOpenState,
  expandBtnPositionState,
  expandBtnVisibleState,
} from '@/views/Main/state/okrPath';

const ExpandBtnWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  width: 11px;
  height: 14px;
  background-color: var(--container_bg);
  transform: translate(-4px, 5px) translateX(-100%);
  transition: background-color var(--trans_speed_level1);

  &.hide {
    background-color: transparent;
  }

  &::after {
    content: '';
    display: block;
    border-top: 4px solid transparent;
    border-right: 0;
    border-bottom: 4px solid transparent;
    border-left: 5px solid #fff;
    transition: transform var(--trans_speed_level2) ease;
  }

  &.hide::after {
    display: none;
  }

  &.isOpen::after {
    transform: rotate(90deg);
  }
`;

const ExpandBtn = () => {
  const visible = useRecoilValue(expandBtnVisibleState);
  const position = useRecoilValue(expandBtnPositionState);
  const isOpen = useRecoilValue(expandBtnIsOpenState);

  return (
    <ExpandBtnWrapper
      className={classNames({ hide: !visible, isOpen })}
      style={{ ...position }}
    />
  );
};

export default ExpandBtn;
