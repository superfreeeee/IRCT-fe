import styled from 'styled-components';

import { IM_WIDTH } from '../styles';

export const IMContainer = styled.div`
  position: relative;
  width: ${IM_WIDTH}px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 30px);
  margin: 15px 10px 15px 0;
  border-radius: 10px;
  background-color: var(--im_bg);
  z-index: 100;
`;

export const SearchBar = styled.div`
  display: flex;
  margin: 9px 10px 0;

  .input {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 8px;
    border: 0;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.5);
    background-color: #252525;

    i {
      margin-right: 8px;
    }

    input {
      flex: 1;
      border: 0;
      outline: 0;
      color: rgba(255, 255, 255, 0.5);
      background-color: unset;
    }
  }
`;
