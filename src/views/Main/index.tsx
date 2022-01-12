import React from 'react';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import VideoRoom from './VideoRoom';
import { MainContainer } from './styles';

const Main = () => {
  return (
    <MainContainer>
      <StatusBar />
      <IM />
      <RoomSpace />
      {/* <VideoRoom /> */}
    </MainContainer>
  );
};

export default Main;
