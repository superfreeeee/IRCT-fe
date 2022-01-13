import styled from 'styled-components';

export const HidePageWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
  background-color: #bfbfbf;

  &.revert img {
    transform: rotate(180deg);
  }
`;
