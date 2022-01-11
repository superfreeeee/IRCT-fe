import React from 'react';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import VideoRoom from './VideoRoom';
import { Container } from './styles';

const Main = () => {
  return (
    <Container>
      <StatusBar />
      <IM />
      <RoomSpace />
      {/* <VideoRoom /> */}
    </Container>
  );
};

export default Main;
