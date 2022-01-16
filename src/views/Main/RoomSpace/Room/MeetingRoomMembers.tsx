import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@store/reducers';
import {
  joinRoomSpaceAction,
  leaveRoomSpaceAction,
  SpaceFigureWithVideo,
  updateNearbyFiguresAction,
  VideoVoiceRate,
} from '@store/reducers/space';
import Avatar from '@components/Avatar';
import { MeetingRoomAddBtn, MeetingRoomMembersWrapper } from './styles';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { useRecoilValue } from 'recoil';
import { selectedRoomInfoState } from '@views/Main/state/im';
import {
  currentUserTeamDataState,
  userVideoVoiceSwitchFamily,
} from '@views/Main/state/user';

const MeetingRoomMembers = () => {
  const currentUser = useRecoilValue(currentUserTeamDataState);
  const videoVoiceSwitch = useRecoilValue(
    userVideoVoiceSwitchFamily(currentUser.id),
  );

  const simulationSpaces = useSelector(
    (state: AppState) => state.space.simulationSpaces,
  );
  const { roomId: selectedRoomId, followeeId } = useRecoilValue(
    selectedRoomInfoState,
  );
  const { list: rooms } = useSelector((state: AppState) => state.room);
  const space = simulationSpaces[selectedRoomId];

  const dispatch = useDispatch();
  // join room
  useEffect(() => {
    const joinRoomSpace = bindActionCreators(joinRoomSpaceAction, dispatch);
    const leaveRoomSpace = bindActionCreators(leaveRoomSpaceAction, dispatch);

    joinRoomSpace({
      roomId: selectedRoomId,
      figure: {
        userId: currentUser.id,
        avatar: currentUser.avatar,
        state: currentUser.state,
        position: [0, 0],
        active: false,
        mute: !videoVoiceSwitch,
      },
    });

    return () => {
      leaveRoomSpace(selectedRoomId, currentUser.id);
      // TODO clear console
      console.log(`[MeetingRoomMembers] clear currentSapce`);
    };
  }, [selectedRoomId, followeeId, currentUser.id]);

  /**
   * update nearbyFigures
   *   1. switch room  => selectedRoomId
   *   2. members change => figures
   */
  useEffect(() => {
    if (!space) {
      return;
    }

    const updateNearbyFigures = bindActionCreators(
      updateNearbyFiguresAction,
      dispatch,
    );

    const figures: SpaceFigureWithVideo[] = space.figures.map((figure) => ({
      ...figure,
      voiceRate: VideoVoiceRate.LEVEL1,
    }));

    const room = rooms.filter((room) => room.id === selectedRoomId)[0];

    updateNearbyFigures({
      room,
      figures,
    });
  }, [selectedRoomId, space?.figures.length]);

  const addNewMember = () => {
    console.log(`[MeetingRoomMembers] addNewMember`);
  };

  return (
    <MeetingRoomMembersWrapper>
      {space?.figures.map(({ userId, avatar }) => (
        <Avatar key={userId}>
          <img src={avatar} width={'100%'} />
        </Avatar>
      ))}
      <MeetingRoomAddBtn onClick={addNewMember}>
        <BoxIcon type={BoxIconType.Plus} size={'sm'} />
      </MeetingRoomAddBtn>
    </MeetingRoomMembersWrapper>
  );
};

export default MeetingRoomMembers;
