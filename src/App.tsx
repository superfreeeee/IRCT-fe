import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import Layout from './views/Layout';

const GlobalStyle = createGlobalStyle`
  :root {
    /* 大区域背景 */
    --main_bg: #171717;
    --container_bg: #313132;
    --app_sidebar_bg: #1e1e1e;
    --avatar_default_bg: #777;
    --modal_bg: rgba(102, 103, 104, 0.7);
    /* menu tag 相关 */
    --menu_tab_text: #C7C7C7;
    /* menu item 相关 */
    --menu_item_bg_hover: rgba(71, 72, 73, 0.3);
    --menu_item_bg_active: rgb(71, 72, 73);
    --menu_item_tip_bg: #242424;
    --menu_item_option_bg: #C4C4C4;
    --menu_item_unread_bg: #FF8989;
    /* room space 相关 */
    --room_space_area_bg: #474849;
    --room_space_chat_record_bg_other: #474849;
    --room_space_chat_record_bg_self: #BCBEC0;
    --room_space_figure_radius_level1: rgba(188, 189, 191, 0.3);
    --room_space_figure_radius_level2: rgba(189, 191, 193, 0.2);
    --room_space_figure_radius_level3: rgba(189, 191, 193, 0.08);
    /* 状态颜色 */
    --state_idle: #5DD45A;
    --state_busy: #EDD171;
    --state_talking: #5ABED4;
    /* divider color */
    --divider_color_bg: rgba(129, 130, 132, 0.6);
    /* transition speed */
    --trans_speed_level1: 0.1s;
    --trans_speed_level2: 0.2s;
    --trans_speed_level3: 0.3s;
    --trans_speed_level4: 0.4s;
    --trans_speed_level5: 0.5s;
    /* z-index */
    --z_index_level1: 3000; // top level
    --z_index_level2: 2000; // modals
    --z_index_level3: 1000; // IM state tooltip / PathBoard ItemTooltip
    --z_index_level4: 100;
    --z_index_level5: 10;
    --z_index_level6: 1;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'PingFangSC';
  }

  body {
    min-width: 100vw;
    height: 100vh;
  }

  /* clear default element style */
  input {
    border: 0;
    outline: 0;
  }
`;

const AppRoot = styled.div`
  width: 100%;
  height: 100%;
`;

const App: FC = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <AppRoot>
          <GlobalStyle />
          <Layout />
        </AppRoot>
      </BrowserRouter>
    </RecoilRoot>
  );
};

export default App;
