import Avatar from '@components/Avatar';
import styled from 'styled-components';

import { IM_WIDTH } from '../styles';

export const IMContainer = styled.div`
  position: relative;
  width: ${IM_WIDTH}px;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 14px;
  border-radius: 30px;
  background-color: var(--im_bg);
  z-index: 100;
`;

export const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 14px;
  margin-bottom: 12px;

  .selection {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    color: #fff;

    i {
      margin: 0 6px 0 0px;
    }
  }

  ${Avatar} {
    position: relative;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  margin-bottom: 12px;

  .input {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 6px 9px;
    border: 0;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.5);
    background-color: var(--menu_tab_bg);

    i {
      margin-right: 6px;
    }

    input {
      flex: 1;
      border: 0;
      outline: 0;
      color: rgba(255, 255, 255, 0.5);
      background-color: unset;
    }
  }

  & > i {
    margin: 0 5px 0 10px;
    color: #fff;
  }
`;

export const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 9px;
`;

export const Tab = styled.button`
  flex: 1;
  height: 32px;
  border: 0;
  border-radius: 10px;
  font-size: 14px;
  color: var(--menu_tab_text);
  background-color: var(--menu_tab_bg);
  cursor: pointer;

  &.active {
    color: #fff;
    background-color: var(--menu_tab_bg_active);
  }
`;
