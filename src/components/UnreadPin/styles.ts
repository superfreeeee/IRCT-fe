import styled from 'styled-components';

export const UnreadWrapper = styled.div`
  position: absolute;
  left: -4px;
  top: -4px;
  padding: 0 4px;
  border-radius: 3px;
  font-size: 12px;
  background-color: var(--menu_item_unread_bg);

  &::after {
    content: '';
    position: absolute;
    left: 8px;
    bottom: 1px;
    border: 4px solid transparent;
    border-top: 4px solid var(--menu_item_unread_bg);
    transform: translate(-50%, 100%);
  }
`;
