import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import useLog from '@hooks/useLog';
import VideoBlock from './VideoBlock';
import { VideoRoomContainer } from './styles';

const VideoRoom = () => {
  const nearbyFigures = useSelector(
    (state: AppState) => state.space.nearbyFigures,
  ).sort((f1, f2) => f2.voiceRate - f1.voiceRate);

  useLog({ nearbyFigures }, 'VideoRoom.useLog');

  return (
    <VideoRoomContainer>
      {nearbyFigures.map((figure) => (
        <VideoBlock key={figure.userId} figure={figure} />
      ))}
    </VideoRoomContainer>
  );
};

export default VideoRoom;
