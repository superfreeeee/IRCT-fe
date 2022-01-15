import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import { RoomType } from '@store/reducers/room';
import VideoBlock from './VideoBlock';
import { VideoRoomContainer } from './styles';

const VideoRoom = () => {
  const nearbyFigures = useSelector(
    (state: AppState) => state.space.nearbyFigures,
  ).sort((f1, f2) => f2.voiceRate - f1.voiceRate);

  const { list: rooms, selected } = useSelector(
    (state: AppState) => state.room,
  );
  const isMeeting =
    rooms.filter((room) => room.id === selected)[0]?.type === RoomType.Meeting;

  return (
    <VideoRoomContainer>
      {nearbyFigures.map((figure) => (
        <VideoBlock key={figure.userId} figure={figure} isMeeting={isMeeting} />
      ))}
    </VideoRoomContainer>
  );
};

export default VideoRoom;
