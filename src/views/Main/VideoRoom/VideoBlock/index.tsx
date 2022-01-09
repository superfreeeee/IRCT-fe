import React, { FC } from 'react';

import { SpaceFigureWithVideo } from '@store/reducers/space';
import { VideoBlockContainer } from './styles';

interface VideoBlockProps {
  figure: SpaceFigureWithVideo;
}

const VideoBlock: FC<VideoBlockProps> = ({ figure }) => {
  return (
    <VideoBlockContainer>
      {figure.userId}-{figure.voiceRate}
    </VideoBlockContainer>
  );
};

export default VideoBlock;
