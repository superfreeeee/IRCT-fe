import React, { FC } from 'react';

import { SpaceFigureWithVideo, VideoVoiceRate } from '@store/reducers/space';
import {
  VideoBlockContainer,
  VideoBlockContent,
  VideoBlockWrapper,
} from './styles';
import classNames from 'classnames';

interface VideoBlockProps {
  figure: SpaceFigureWithVideo;
}

const VideoBlock: FC<VideoBlockProps> = ({ figure }) => {
  const { voiceRate } = figure;
  const level2 = voiceRate === VideoVoiceRate.LEVEL2;
  const level3 = voiceRate === VideoVoiceRate.LEVEL3;
  return (
    <VideoBlockContainer className={classNames({ sm: level2, hidden: level3 })}>
      <VideoBlockWrapper>
        <VideoBlockContent>
          {figure.userId}-{figure.voiceRate}
        </VideoBlockContent>
      </VideoBlockWrapper>
    </VideoBlockContainer>
  );
};

export default VideoBlock;
