import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import { TabOption } from '../state/type';
import { currentTabState, selectedRoomIdState } from '../state/im';
import {
  currentSpaceIdState,
  currentSpaceTypeState,
  expandVideoRoomState,
  roomSpaceVisibleState,
} from '../state/roomSpace';
import {
  currentUserTeamDataState,
  userVideoRoomSettingFamily,
  userVideoVisibleFamily,
  userVideoVoiceSwitchFamily,
} from '../state/user';
import { useExitRoom } from '../state/hooks';
import Avatar from '@/components/Avatar';
import BoxIcon, { BoxIconType } from '@/components/BoxIcon';
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
  /**
   * 当前用户基本信息
   */
  const { id, state, avatar } = useRecoilValue(currentUserTeamDataState);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  const roomSpaceVisible = useRecoilValue(roomSpaceVisibleState);
  const [expandVideoRoom, setExpandVideoRoom] =
    useRecoilState(expandVideoRoomState);

  const currentSpaceType = useRecoilValue(currentSpaceTypeState);

  // for render
  const isInRoom = !!selectedRoomId;
  const showController =
    !roomSpaceVisible ||
    currentSpaceType === TabOption.Team ||
    !expandVideoRoom;

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
  const exitRoom = useExitRoom();
  const exitVideoRoom = () => {
    exitRoom();
  };

  /**
   * 跳转到所在房间
   */
  const setCurrentTab = useSetRecoilState(currentTabState);
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);
  const jumpAndExpandRoomSpace = () => {
    setCurrentTab(TabOption.Room);
    setCurrentSpaceId(selectedRoomId);
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
        {isInRoom && (
          <MeetingActions>
            {showController && (
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
