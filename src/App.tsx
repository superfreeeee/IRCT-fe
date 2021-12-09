import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import Layout from './views/Layout';

const AppRoot = styled.div``;

const GlobalStyle = createGlobalStyle`
  :root {
    /* 大区域背景 */
    --root_bg: #d9d9d9;
    --im_bg: #757575;
    /* menu tag 相关 */
    --menu_tab_bg: #444444;
    --menu_tab_bg_active: #292929;
    --menu_tab_text: #C7C7C7;
    /* menu item 相关 */
    --menu_item_bg: #D1D1D1;
    --menu_item_bg_hover: #A7A7A7;
    --menu_item_bg_active: #444444;
    --menu_item_tip_bg: #2E2E2E;
    --menu_item_option_bg: #C4C4C4;
    --menu_item_unread_bg: #FF8989;
    /* 状态颜色 */
    --state_idle: #5DD45A;
    --state_work: rgba(11, 177, 214, 0.6);
    --state_busy: rgba(255, 210, 49, 0.6);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 100vw;
    height: 100vh;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }
`;

const App: FC = () => {
  return (
    <BrowserRouter>
      <AppRoot>
        <GlobalStyle />
        <Layout />
      </AppRoot>
    </BrowserRouter>
  );
};

export default App;
