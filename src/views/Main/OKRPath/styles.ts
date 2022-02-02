import styled from 'styled-components';

export const OKRPathContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 24px 32px;
  overflow: hidden;

  &.hide {
    display: none;
  }
`;

export const OKRIconActions = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
`;

export const OKRIconBtn = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  color: white;
  background-color: #474849;

  &.disabled::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;
