import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { AppState } from '@store/reducers';
import { exitRoomAction } from '@store/reducers/room';
import { switchTabAction } from '@store/reducers/im';
import { switchSpaceAction } from '@store/reducers/space';
import {
  toggleVideoVisibleAction,
  toggleVideoVoiceAction,
} from '@store/reducers/user';
import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { TabOption } from '../IM/type';
import {
  AvatarBlock,
  InMeetingIcon,
  MeetingActionBtn,
  MeetingActions,
  StateUnderline,
  StatusBarBottom,
  StatusBarContainer,
} from './styles';
import { expandVideoRoomState } from '../state/roomSpace';

const StatusBar = () => {
  const [expandVideoRoom, setExpandVideoRoom] =
    useRecoilState(expandVideoRoomState);

  const { state, avatar, videoVisible, videoVoice } = useSelector(
    (state: AppState) => state.user,
  );
  const selectedRoomId = useSelector((state: AppState) => state.room.selected);
  const { currentSpace } = useSelector((state: AppState) => state.space);

  const inMeeting = !!selectedRoomId;
  const videoRoomHidden = currentSpace !== TabOption.Room || !expandVideoRoom;

  const dispatch = useDispatch();
  // 房间状态：屏幕 | 声音
  const toggleVideoVisible = bindActionCreators(
    toggleVideoVisibleAction,
    dispatch,
  );
  const toggleVideoVoice = bindActionCreators(toggleVideoVoiceAction, dispatch);

  /**
   * 离开房间
   */
  const exitVideoRoom = () => {
    console.log(`[StatusBar] exitVideoRoom`);
    const exitRoom = bindActionCreators(exitRoomAction, dispatch);
    const reserveSpace = currentSpace === TabOption.Team;
    exitRoom(reserveSpace);
  };

  /**
   * 跳转到所在房间
   */
  const jumpAndExpandRoomSpace = () => {
    console.log(`[StatusBar] jumpToRoomSpace`);
    const switchTab = bindActionCreators(switchTabAction, dispatch);
    const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
    switchTab(TabOption.Room);
    switchSpace(TabOption.Room);
    setExpandVideoRoom(true);
  };

  return (
    <StatusBarContainer>
      {/* 上半 */}
      <AvatarBlock>
        <Avatar>
          <img src={avatar} width={'140%'} />
        </Avatar>
        <StateUnderline state={state} />
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
            <InMeetingIcon onClick={jumpAndExpandRoomSpace}>
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
