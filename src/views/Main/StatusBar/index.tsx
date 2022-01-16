import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { AppState } from '@store/reducers';
import { switchSpaceAction } from '@store/reducers/space';
import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { TabOption } from '@views/Main/state/type';
import { currentTabState, selectedRoomInfoState } from '@views/Main/state/im';
import {
  AvatarBlock,
  InMeetingIcon,
  MeetingActionBtn,
  MeetingActions,
  StateUnderline,
  StatusBarBottom,
  StatusBarContainer,
} from './styles';
import { currentSpaceIdState, expandVideoRoomState } from '../state/roomSpace';
import {
  currentUserTeamDataState,
  userVideoRoomSettingFamily,
  userVideoVisibleFamily,
  userVideoVoiceSwitchFamily,
} from '../state/user';

const StatusBar = () => {
  const [expandVideoRoom, setExpandVideoRoom] =
    useRecoilState(expandVideoRoomState);

  /**
   * 当前用户基本信息
   */
  const { id, state, avatar } = useRecoilValue(currentUserTeamDataState);
  const [{ roomId: selectedRoomId }, setSelectedRoomInfo] = useRecoilState(
    selectedRoomInfoState,
  );

  const { currentSpace } = useSelector((state: AppState) => state.space);

  const inMeeting = !!selectedRoomId;
  const videoRoomHidden = currentSpace !== TabOption.Room || !expandVideoRoom;

  /**
   * 当前用户视频设定
   */
  const { videoVisible, videoVoiceSwitch } = useRecoilValue(
    userVideoRoomSettingFamily(id),
  );

  // 更新用户视频设定
  const setUserVideoVisible = useSetRecoilState(userVideoVisibleFamily(id));
  const setUserVideoVoiceSwitch = useSetRecoilState(
    userVideoVoiceSwitchFamily(id),
  );

  const toggleVideoVisible = () => setUserVideoVisible(!videoVisible);
  const toggleVideoVoiceSwitch = () =>
    setUserVideoVoiceSwitch(!videoVoiceSwitch);

  /**
   * 离开房间
   */
  const exitVideoRoom = () => {
    console.log(`[StatusBar] exitVideoRoom`);
    setSelectedRoomInfo({ roomId: '', followeeId: '' });
  };

  const dispatch = useDispatch();
  /**
   * 跳转到所在房间
   */
  const setCurrentTab = useSetRecoilState(currentTabState);
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);
  const jumpAndExpandRoomSpace = () => {
    console.log(`[StatusBar] jumpToRoomSpace`);
    const switchSpace = bindActionCreators(switchSpaceAction, dispatch);
    setCurrentTab(TabOption.Room);
    setCurrentSpaceId(selectedRoomId);
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
