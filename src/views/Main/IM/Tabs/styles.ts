import styled from 'styled-components';

export const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid var(--divider_color_bg);
`;

export const Tab = styled.button`
  position: relative;
  flex: 1;
  height: 36px;
  padding: 8px 0;
  border: 0;
  border-radius: 10px;
  font-size: 14px;
  color: var(--menu_tab_text);
  background-color: transparent;
  /* cursor: pointer; */
  user-select: none;

  &.active {
    color: #fff;
    background-color: transparent;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      display: block;
      width: 46px;
      height: 1px;
      background-color: #e2e3e4;
      transform: translate(-50%, 1px);
    }
  }
`;
