import React, { FC, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import {
  userUsingAppFamily,
  userVideoRoomSettingFamily,
} from '@views/Main/state/user';
import { VideoRoomFigure, VideoVoiceRate } from '@views/Main/state/type';
import {
  VideoBlockContainer,
  VideoBlockContent,
  VideoBlockTitle,
  VideoBlockWrapper,
} from './styles';
import Avatar from '@components/Avatar';
import AppIcon from '@components/AppIcon';

interface VideoBlockProps {
  figure: VideoRoomFigure;
  count: number;
  isMeeting?: boolean;
}

const VideoBlock: FC<VideoBlockProps> = ({
  figure,
  count,
  isMeeting = false,
}) => {
  // 当前用户信息
  const { id, avatar, name, videoUrl } = figure;
  const usingApp = useRecoilValue(userUsingAppFamily(id));

  // 视频设定
  const { videoVisible } = useRecoilValue(userVideoRoomSettingFamily(id));
  const hideVideo = !videoVisible;

  // 视频控制
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (video.fastSeek) {
      video.fastSeek(0);
    } else {
      video.currentTime = 0;
      video.src &&
        video.play().catch((e) => {
          if (e instanceof DOMException) {
            const autoPlayFailMsg = `try play before user interact`;
            console.warn(
              `[VideoBlock] play video fail(${id}): ${autoPlayFailMsg}`,
            );
          } else {
            return Promise.reject(e);
          }
        });
    }
  }, [count]);

  // 声音设定
  const voiceRate = isMeeting ? VideoVoiceRate.LEVEL1 : figure.voiceRate;
  const level2 = voiceRate === VideoVoiceRate.LEVEL2;
  const level3 = voiceRate === VideoVoiceRate.LEVEL3;

  // 音频控制
  useEffect(() => {
    videoRef.current.volume = voiceRate / 100;
    // console.log(
    //   `[VideoBlock] user(${id}), voiceRate = ${videoRef.current.volume}`,
    // );
  }, [voiceRate]);

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
            <video
              autoPlay
              // muted
              className="video"
              ref={videoRef}
              src={videoUrl}
            ></video>
            // <span>
            //   {figure.id}-{figure.voiceRate}
            // </span>
          )}
          <VideoBlockTitle>
            <Avatar className={classNames({ hideVideo })}>
              <img src={avatar} width={'100%'} />
            </Avatar>
            {name}
          </VideoBlockTitle>
          {usingApp && <AppIcon type={usingApp} size={22} />}
        </VideoBlockContent>
      </VideoBlockWrapper>
    </VideoBlockContainer>
  );
};

export default VideoBlock;
