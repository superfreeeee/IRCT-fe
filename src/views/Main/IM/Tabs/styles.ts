import styled from 'styled-components';

export const TabsContainer = styled.div`
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
  user-select: none;

  &.active {
    color: #fff;
    background-color: var(--menu_tab_bg_active);
  }
`;
