import styled from 'styled-components';

const IM_WIDTH = 248;

export const IMContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: ${IM_WIDTH}px;
  height: calc(100% - 30px);
  margin: 15px 10px 15px 0;
  border-radius: 10px;
  background-color: var(--container_bg);
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
      color: rgba(255, 255, 255, 0.5);
      background-color: transparent;
    }
  }
`;
