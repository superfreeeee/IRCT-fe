import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import { userVideoRoomSettingFamily } from '@views/Main/state/user';
import { VideoRoomFigure, VideoVoiceRate } from '@views/Main/state/type';
import {
  VideoBlockContainer,
  VideoBlockContent,
  VideoBlockTitle,
  VideoBlockWrapper,
} from './styles';
import Avatar from '@components/Avatar';
import AppIcon from '@components/AppIcon';
import { teamDataFamily } from '@views/Main/state/team';

interface VideoBlockProps {
  figure: VideoRoomFigure;
  isMeeting?: boolean;
}

const VideoBlock: FC<VideoBlockProps> = ({ figure, isMeeting = false }) => {
  // 当前用户信息
  const {
    avatar,
    name: userName,
    usingApp,
  } = useRecoilValue(teamDataFamily(figure.id));
  // 用户房间设定
  const { videoVisible } = useRecoilValue(
    userVideoRoomSettingFamily(figure.id),
  );

  const voiceRate = isMeeting ? VideoVoiceRate.LEVEL1 : figure.voiceRate;
  const level2 = voiceRate === VideoVoiceRate.LEVEL2;
  const level3 = voiceRate === VideoVoiceRate.LEVEL3;

  const hideVideo = !videoVisible;

  return (
    <VideoBlockContainer
      className={classNames({
        sm: !isMeeting && (level2 || level3),
        hidden: !isMeeting && level3,
      })}
    >
      <VideoBlockWrapper>
        <VideoBlockContent className={classNames({ hide: hideVideo })}>
          {hideVideo ? (
            <Avatar>
              <img src={avatar} width={'100%'} />
            </Avatar>
          ) : (
            <span>
              {figure.id}-{figure.voiceRate}
            </span>
          )}
          <VideoBlockTitle>
            <Avatar className={classNames({ hideVideo })}>
              <img src={avatar} width={'100%'} />
            </Avatar>
            {userName}
          </VideoBlockTitle>
          {usingApp && <AppIcon type={usingApp} size={22} />}
        </VideoBlockContent>
      </VideoBlockWrapper>
    </VideoBlockContainer>
  );
};

export default VideoBlock;
