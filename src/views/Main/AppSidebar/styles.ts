import styled from 'styled-components';

export const AppSidebarContainer = styled.div`
  flex: 1;
  display: none;
  height: calc(100% - 30px);
  padding: 5px;
  margin: 15px 15px 15px 0;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  color: #fff;
  background-color: var(--app_sidebar_bg);
  overflow: hidden;
  transform: translateX(200%);
  transition: all var(--trans_speed_level3);

  &.isVisible {
    display: block;
    transform: translateX(0);
  }

  &.withPath {
    position: fixed;
    right: 0;
    top: 0;
    min-width: 30%;
  }
`;
