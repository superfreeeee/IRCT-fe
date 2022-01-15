import React, { FC } from 'react';

import { SpaceFigureWithVideo, VideoVoiceRate } from '@store/reducers/space';
import {
  VideoBlockContainer,
  VideoBlockContent,
  VideoBlockTitle,
  VideoBlockWrapper,
} from './styles';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { AppState } from '@store/reducers';
import Avatar from '@components/Avatar';
import AppIcon from '@components/AppIcon';

interface VideoBlockProps {
  figure: SpaceFigureWithVideo;
}

const VideoBlock: FC<VideoBlockProps> = ({ figure }) => {
  const {
    id: currentUserId,
    avatar: selfAvatar,
    name,
    videoVisible,
  } = useSelector((state: AppState) => state.user);
  const userList = useSelector((state: AppState) => state.team.list);
  const getUser = (userId: string) => {
    return userList.filter((user) => user.id === userId)[0];
  };

  const isSelf = figure.userId === currentUserId;
  const figureUser = getUser(figure.userId);

  const { voiceRate } = figure;
  const level2 = voiceRate === VideoVoiceRate.LEVEL2;
  const level3 = voiceRate === VideoVoiceRate.LEVEL3;

  const hideVideo = isSelf && !videoVisible;
  const avatar = isSelf ? selfAvatar : figureUser?.avatar;
  const userName = isSelf ? name : figureUser?.title;
  const usingApp = !isSelf && figureUser?.usingApp;

  return (
    <VideoBlockContainer className={classNames({ sm: level2, hidden: level3 })}>
      <VideoBlockWrapper>
        <VideoBlockContent className={classNames({ hide: hideVideo })}>
          {hideVideo ? (
            <Avatar>
              <img src={avatar} width={'100%'} />
            </Avatar>
          ) : (
            <span>
              {figure.userId}-{figure.voiceRate}
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
