import React from 'react';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import { MainContainer } from './styles';
import AppSidebar from './AppSidebar';

const Main = () => {
  return (
    <MainContainer>
      <StatusBar />
      <IM />
      <RoomSpace />
      <AppSidebar />
    </MainContainer>
  );
};

export default Main;
