import React, { FC, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import classNames from 'classnames';

import {
  contextMenuPositionState,
  contextMenuVisibleState,
} from '@/views/Main/state/modals/customContextMenu';
import useClickDetect from '@/hooks/useClickDetect';
import { CustomContextMenuContainer } from './styles';

interface ContextMenuProps {
  onCancel?: () => void;
}

const ContextMenu: FC<ContextMenuProps> = ({ children, onCancel }) => {
  const [visible, setVisible] = useRecoilState(contextMenuVisibleState);
  const position = useRecoilValue(contextMenuPositionState);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickDetect(
    wrapperRef,
    (isOutSide, e) => {
      if (isOutSide) {
        e.stopPropagation(); // 避免同时触发后续动作

        setVisible(false);
        onCancel && onCancel();
      }
    },
    visible,
  );

  return (
    <CustomContextMenuContainer
      ref={wrapperRef}
      className={classNames({ visible })}
      style={{ ...position }}
    >
      {children}
    </CustomContextMenuContainer>
  );
};

export default ContextMenu;
