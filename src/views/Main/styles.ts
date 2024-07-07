import styled from 'styled-components';

import '@/assets/img/cursor.png';

export const MainContainer = styled.div`
  display: flex;
  align-items: flex-start;
  min-width: 100vw;
  height: 100vh;
  background-color: var(--main_bg);
  overflow: auto;

  /* 默认鼠标样式 */
  &,
  * {
    cursor: url(/img/cursor.png), default;
  }
`;
