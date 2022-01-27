import styled from 'styled-components';

export const OKRPathContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 24px 32px;

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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  color: white;
  background-color: #474849;
`;
