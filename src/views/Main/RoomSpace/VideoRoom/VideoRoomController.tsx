import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { MeetingActionBtn } from '@views/Main/StatusBar/styles';
import { AppState } from '@store/reducers';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { VideoRoomControllerContainer } from './styles';
import {
  toggleVideoVisibleAction,
  toggleVideoVoiceAction,
} from '@store/reducers/user';
import { exitRoomAction } from '@store/reducers/room';
import { TabOption } from '@views/Main/IM/type';

const VideoRoomController = () => {
  const { videoVisible, videoVoice } = useSelector(
    (state: AppState) => state.user
  );

  const dispatch = useDispatch();
  // 房间状态：屏幕 | 声音
  const toggleVideoVisible = bindActionCreators(
    toggleVideoVisibleAction,
    dispatch
  );
  const toggleVideoVoice = bindActionCreators(toggleVideoVoiceAction, dispatch);

  /**
   * 离开房间
   */
  const exitVideoRoom = () => {
    console.log(`[StatusBar] exitVideoRoom`);
    const exitRoom = bindActionCreators(exitRoomAction, dispatch);
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
        className={classNames({ off: !videoVoice })}
        onClick={toggleVideoVoice}
      >
        <BoxIcon
          type={
            videoVoice ? BoxIconType.Microphone : BoxIconType.MicrophoneOffFill
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
