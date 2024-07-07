import React from 'react';
import classNames from 'classnames';

import { MeetingActionBtn } from '@/views/Main/StatusBar/styles';
import BoxIcon, { BoxIconType } from '@/components/BoxIcon';
import { VideoRoomControllerContainer } from './styles';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentUserIdState,
  userVideoRoomSettingFamily,
  userVideoVisibleFamily,
  userVideoVoiceSwitchFamily,
} from '@/views/Main/state/user';
import { useExitRoom } from '@/views/Main/state/hooks';

const VideoRoomController = () => {
  const id = useRecoilValue(currentUserIdState);
  // 房间状态：屏幕 | 声音
  const { videoVisible, videoVoiceSwitch } = useRecoilValue(
    userVideoRoomSettingFamily(id),
  );

  const setUserVideoVisible = useSetRecoilState(userVideoVisibleFamily(id));
  const setUserVideoVoiceSwitch = useSetRecoilState(
    userVideoVoiceSwitchFamily(id),
  );

  // 更新状态
  const toggleVideoVisible = () => setUserVideoVisible(!videoVisible);
  const toggleVideoVoiceSwitch = () =>
    setUserVideoVoiceSwitch(!videoVoiceSwitch);

  /**
   * 离开房间
   */
  const exitRoom = useExitRoom();
  const exitVideoRoom = () => {
    exitRoom();
  };

  return (
    <VideoRoomControllerContainer>
      <MeetingActionBtn
        className={classNames({ off: !videoVisible })}
        onClick={toggleVideoVisible}
      >
        <BoxIcon
          type={videoVisible ? BoxIconType.Video : BoxIconType.VideoOff}
        />
      </MeetingActionBtn>
      <MeetingActionBtn
        className={classNames({ off: !videoVoiceSwitch })}
        onClick={toggleVideoVoiceSwitch}
      >
        <BoxIcon
          type={
            videoVoiceSwitch
              ? BoxIconType.Microphone
              : BoxIconType.MicrophoneOffFill
          }
        />
      </MeetingActionBtn>
      <MeetingActionBtn className="hangUp" onClick={exitVideoRoom}>
        <BoxIcon type={BoxIconType.PhoneOff} />
      </MeetingActionBtn>
    </VideoRoomControllerContainer>
  );
};

export default VideoRoomController;
