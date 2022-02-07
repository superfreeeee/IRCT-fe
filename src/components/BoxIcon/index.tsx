import React, { FC } from 'react';
import classNames from 'classnames';

import { I } from './styles';

export enum BoxIconType {
  Branch = 'bx-git-branch',
  Calender = 'bx-calendar',
  Edit = 'bx-edit-alt',
  ExpandVertical = 'bx-expand-vertical',
  File = 'bx-file',
  Group = 'bx-group',
  GroupFill = 'bxs-group',
  LastPage = 'bxs-chevrons-left',
  ListCheck = 'bx-list-check',
  MessageAdd = 'bx-message-square-add',
  MessageDots = 'bx-message-dots',
  Microphone = 'bxs-microphone',
  MicrophoneOff = 'bx-microphone-off',
  MicrophoneOffFill = 'bxs-microphone-off',
  More = 'bx-dots-horizontal-rounded',
  NextPage = 'bxs-chevrons-right',
  PhoneOff = 'bxs-phone-off',
  Plus = 'bx-plus',
  PlusSquare = 'bxs-plus-square',
  Search = 'bx-search',
  SearchAlt = 'bx-search-alt',
  Send = 'bx-send',
  Setting = 'bx-cog',
  TargetLock = 'bx-target-lock',
  Trash = 'bx-trash',
  Undo = 'bx-undo',
  UserCircle = 'bx-user-circle',
  Video = 'bxs-video',
  VideoOff = 'bxs-video-off',
  VoiceWave = 'bx-equalizer',
  Volume = 'bx-volume-full',
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
