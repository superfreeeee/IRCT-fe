import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import useLog from '@hooks/useLog';
import { VideoRoomContainer } from './styles';
import VideoBlock from './VideoBlock';

const VideoRoom = () => {
  // const currentSpace = useSelector(
  //   (state: AppState) => state.space.currentSpace
  // );

  const { id: userId } = useSelector((state: AppState) => state.user);
  const nearbyFigures = useSelector(
    (state: AppState) => state.space.nearbyFigures
  )
    .filter((figure) => figure.userId !== userId)
    .sort((f1, f2) => f2.voiceRate - f1.voiceRate);

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