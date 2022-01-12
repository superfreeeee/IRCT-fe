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
    --container_bg: #313132;
    --avatar_default_bg: #777;
    /* menu tag 相关 */
    --menu_tab_text: #C7C7C7;
    /* menu item 相关 */
    --menu_item_bg_hover: rgba(71, 72, 73, 0.3);
    --menu_item_bg_active: rgb(71, 72, 73);
    --menu_item_tip_bg: #2E2E2E;
    --menu_item_option_bg: #C4C4C4;
    --menu_item_unread_bg: #FF8989;
    /* room space 相关 */
    --room_space_area_bg: #474849;
    --room_space_chat_record_bg_other: #474849;
    --room_space_chat_record_bg_self: #BCBEC0;
    --room_space_figure_radius_level1: rgba(188, 189, 191, 0.3);
    --room_space_figure_radius_level2: rgba(189, 191, 193, 0.2);
    /* 状态颜色 */
    --state_idle: #5DD45A;
    --state_work: #5ABED4;
    --state_busy: #EDD171;
    /* divider color */
    --divider_color_bg: rgba(129, 130, 132, 0.6);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 100vw;
    height: 100vh;
    /* font-family: 'Poppins', sans-serif; */
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
