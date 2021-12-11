import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import store from './store';
import Layout from './views/Layout';

const AppRoot = styled.div``;

const GlobalStyle = createGlobalStyle`
  :root {
    /* 大区域背景 */
    --root_bg: #d9d9d9;
    --im_bg: #757575;
    --room_space_bg: #C4C4C4;
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
    /* room space 相关 */
    --room_space_area_bg: #EDEDED;
    /* 状态颜色 */
    --state_idle: #5DD45A;
    --state_work: #5ABED4;
    --state_busy: #FFD231;
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
    <Provider store={store}>
      <BrowserRouter>
        <AppRoot>
          <GlobalStyle />
          <Layout />
        </AppRoot>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
