import classNames from 'classnames';
import React, { CSSProperties, FC } from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;

  &.hide {
    display: none;
  }
`;

interface ModalProps {
  visible: boolean;
  className?: string;
  style?: CSSProperties;
}

const Modal: FC<ModalProps> = ({ visible, children, style }) => {
  return (
    <ModalContainer className={classNames({ hide: !visible })} style={style}>
      {children}
    </ModalContainer>
  );
};

export default Modal;
