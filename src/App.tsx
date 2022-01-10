import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import store from './store';
import Layout from './views/Layout';

const GlobalStyle = createGlobalStyle`
  :root {
    /* 大区域背景 */
    --main_bg: #171717;
    --im_bg: #757575;
    --room_space_bg: #C4C4C4;
    --avatar_default_bg: #777;
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
    --room_space_chat_record_bg_other: #838383;
    --room_space_chat_record_bg_self: #E9E9E9;
    --room_space_figure_radius_level1: rgba(162, 231, 161, 0.5);
    --room_space_figure_radius_level2: rgba(162, 231, 161, 0.2);;
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
    font-family: 'Poppins', sans-serif;
  }
`;

const AppRoot = styled.div`
  width: 100%;
  height: 100%;
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
