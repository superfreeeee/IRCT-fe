import React from 'react';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import { MainContainer } from './styles';

const Main = () => {
  return (
    <MainContainer>
      <StatusBar />
      <IM />
      <RoomSpace />
    </MainContainer>
  );
};

export default Main;
