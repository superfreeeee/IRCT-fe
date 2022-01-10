import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Avatar from '@components/Avatar';
import { AppState } from '@store/reducers';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import {
  AvatarBlock,
  InMeetingIcon,
  MeetingActionBtn,
  MeetingActions,
  StateUnderline,
  StatusBarBottom,
  StatusBarContainer,
} from './styles';

const StatusBar = () => {
  const user = useSelector((state: AppState) => state.user);

  // TODO mock inMeeting State
  const inMeeting = true;
  const videoRoomHidden = true;

  const [videoVisible, setVideoVisible] = useState(true);
  const toggleVideoVisible = () => {
    console.log(`[StatusBar] toggleVideoVisible`);
    setVideoVisible(!videoVisible);
  };

  const [videoVoice, setVideoVoice] = useState(true);
  const toggleVideoVoice = () => {
    console.log(`[StatusBar] toggleVideoVoice`);
    setVideoVoice(!videoVoice);
  };

  const exitVideoRoom = () => {
    console.log(`[StatusBar] exitVideoRoom`);
  };

  const jumpToRoomSpace = () => {
    console.log(`[StatusBar] jumpToRoomSpace`);
  };

  return (
    <StatusBarContainer>
      {/* 上半 */}
      <AvatarBlock>
        <Avatar></Avatar>
        <StateUnderline state={user.state} />
      </AvatarBlock>
      {/* 下半 */}
      <StatusBarBottom className="bottom">
        {inMeeting && (
          <MeetingActions>
            {videoRoomHidden && (
              <>
                <MeetingActionBtn onClick={toggleVideoVisible}>
                  <BoxIcon
                    type={
                      videoVisible ? BoxIconType.Video : BoxIconType.VideoOff
                    }
                  />
                </MeetingActionBtn>
                <MeetingActionBtn onClick={toggleVideoVoice}>
                  <BoxIcon
                    type={
                      videoVoice
                        ? BoxIconType.Microphone
                        : BoxIconType.MicrophoneOffFill
                    }
                  />
                </MeetingActionBtn>
                <MeetingActionBtn className="hangUp" onClick={exitVideoRoom}>
                  <BoxIcon type={BoxIconType.PhoneOff} />
                </MeetingActionBtn>
              </>
            )}
            <InMeetingIcon onClick={jumpToRoomSpace}>
              <BoxIcon type={BoxIconType.VoiceWave} />
            </InMeetingIcon>
          </MeetingActions>
        )}
        <BoxIcon type={BoxIconType.Setting} clickable className="setting" />
      </StatusBarBottom>
    </StatusBarContainer>
  );
};

export default StatusBar;
