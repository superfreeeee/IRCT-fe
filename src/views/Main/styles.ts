import styled from 'styled-components';

export const IM_WIDTH = 248;
export const VIDEO_ROOM_WIDTH = 800;

import '@assets/img/cursor.png';

export const MainContainer = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
  background-color: var(--main_bg);
  * {
    cursor: url(/img/cursor.png), default;
  }
`;
