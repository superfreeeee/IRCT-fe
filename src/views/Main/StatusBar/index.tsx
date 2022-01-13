import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import { exitRoomAction } from '@store/reducers/room';
import Avatar from '@components/Avatar';
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
import { TabOption } from '../IM/type';
import { switchTabAction } from '@store/reducers/im';
import { switchSpaceAction } from '@store/reducers/space';
import classNames from 'classnames';

const StatusBar = () => {
  const user = useSelector((state: AppState) => state.user);
  const selectedRoomId = useSelector((state: AppState) => state.room.selected);
  const currentSpace = useSelector(
    (state: AppState) => state.space.currentSpace
  );

  // TODO mock inMeeting State
  const inMeeting = !!selectedRoomId;
  // TODO and videoRoom shrink
  const videoRoomHidden = currentSpace !== TabOption.Room;

  /**
   * 视屏通话状态：屏幕
   */
  const [videoVisible, setVideoVisible] = useState(true);
  const toggleVideoVisible = () => {
    console.log(`[StatusBar] toggleVideoVisible`);
    setVideoVisible(!videoVisible);
  };

  /**
   * 视屏通话状态：声音
   */
  const [videoVoice, setVideoVoice] = useState(true);
  const toggleVideoVoice = () => {
    console.log(`[StatusBar] toggleVideoVoice`);
    setVideoVoice(!videoVoice);
  };

  /**
   * 离开房间
   */
  const dispatch = useDispatch();
  const exitVideoRoom = () => {
    console.log(`[StatusBar] exitVideoRoom`);
    const exitRoom = bindActionCreators(exitRoomAction, dispatch);
    const reserveSpace = currentSpace === TabOption.Team;
    exitRoom(reserveSpace);
  };

  /**
   * 跳转到所在房间
   */
  const jumpToRoomSpace = () => {
    console.log(`[StatusBar] jumpToRoomSpace`);
    const switchTab = bindActionCreators(switchTabAction, dispatch);
    const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
    switchTab(TabOption.Room);
    switchSpace(TabOption.Room);
  };

  return (
    <StatusBarContainer>
      {/* 上半 */}
      <AvatarBlock>
        <Avatar>
          <img src={user.avatar} width={'140%'} />
        </Avatar>
        <StateUnderline state={user.state} />
      </AvatarBlock>
      {/* 下半 */}
      <StatusBarBottom className="bottom">
        {inMeeting && (
          <MeetingActions>
            {videoRoomHidden && (
              <>
                <MeetingActionBtn
                  className={classNames({ off: !videoVisible })}
                  onClick={toggleVideoVisible}
                >
                  <BoxIcon
                    type={
                      videoVisible ? BoxIconType.Video : BoxIconType.VideoOff
                    }
                  />
                </MeetingActionBtn>
                <MeetingActionBtn
                  className={classNames({ off: !videoVoice })}
                  onClick={toggleVideoVoice}
                >
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
