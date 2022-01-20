import styled from 'styled-components';

export const OKRListContainer = styled.div`
  min-width: 250px;
  height: calc(100% - 30px);
  margin: 15px 15px 15px 0;
  border-radius: 10px;
  background-color: var(--container_bg);

  &.hide {
    display: none;
  }
`;
