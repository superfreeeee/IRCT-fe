import styled from 'styled-components';

export const CustomContextMenuContainer = styled.div`
  position: fixed;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--trans_speed_level3),
    visibility var(--trans_speed_level3);

  &.visible {
    opacity: 1;
    visibility: visible;
  }
`;

export const CustomContextMenuWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 100px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  background-color: #474849;
`;

export const CustomContextMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 3px 6px;
  border-radius: 5px;
  color: #fff;
  font-size: 12px;

  &:hover {
    background-color: #5b5b5b;
  }
`;
