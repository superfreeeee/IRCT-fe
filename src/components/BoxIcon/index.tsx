import React, { FC } from 'react';
import classNames from 'classnames';

import { I } from './styles';

export enum BoxIconType {
  ExpandVertical = 'bx-expand-vertical',
  Setting = 'bx-cog',
  Search = 'bx-search',
  Calender = 'bx-calendar',
  File = 'bx-file',
  Branch = 'bx-git-branch',
  ListCheck = 'bx-list-check',
  LastPage = 'bxs-chevrons-left',
  NextPage = 'bxs-chevrons-right',
  Send = 'bx-send',
  Group = 'bx-group',
  Microphone = 'bxs-microphone',
  MicrophoneOff = 'bx-microphone-off',
  MicrophoneOffFill = 'bxs-microphone-off',
  VoiceWave = 'bx-equalizer',
  Video = 'bxs-video',
  VideoOff = 'bxs-video-off',
  PhoneOff = 'bxs-phone-off',
}

interface BoxIconProps {
  type: BoxIconType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const BoxIcon: FC<BoxIconProps> = ({
  type,
  size,
  clickable = false,
  onClick,
  className = '',
}) => {
  const sizeStyle = { [`bx-${size}`]: !!size };
  return (
    <I
      className={classNames('bx', type, sizeStyle, className)}
      clickable={clickable || !!onClick}
      onClick={onClick}
    />
  );
};

export default BoxIcon;
