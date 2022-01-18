import classNames from 'classnames';
import React, { FC } from 'react';
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
}

const Modal: FC<ModalProps> = ({ visible, children }) => {
  return (
    <ModalContainer className={classNames({ hide: !visible })}>
      {children}
    </ModalContainer>
  );
};

export default Modal;
