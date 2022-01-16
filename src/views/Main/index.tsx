import React from 'react';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import { MainContainer } from './styles';
import AppSidebar from './AppSidebar';
import CallModal from './CallModal';

const Main = () => {
  return (
    <MainContainer>
      <StatusBar />
      <IM />
      <RoomSpace />
      <AppSidebar />
      <CallModal />
    </MainContainer>
  );
};

export default Main;
