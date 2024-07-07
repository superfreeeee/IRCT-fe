import React from 'react';
import { useRecoilValue } from 'recoil';

import { selectedRoomTypeState } from '@/views/Main/state/im';
import { RoomType } from '@/views/Main/state/type';
import { nearbyFiguresState } from '@/views/Main/state/roomSpace';
import VideoBlock from './VideoBlock';
import { VideoRoomContainer } from './styles';

const VideoRoom = () => {
  const isMeeting = useRecoilValue(selectedRoomTypeState) === RoomType.Meeting;

  const nearbyFigures = useRecoilValue(nearbyFiguresState);
  const count = nearbyFigures.length;

  return (
    <VideoRoomContainer>
      {nearbyFigures.map((figure) => (
        <VideoBlock
          key={figure.id}
          figure={figure}
          count={count}
          isMeeting={isMeeting}
        />
      ))}
    </VideoRoomContainer>
  );
};

export default VideoRoom;
