import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { selectedRoomIdState } from '@views/Main/state/im';
import { userTalkingListState } from '@views/Main/state/user';
import { roomSpaceUserBasicInfoListFamily } from '@views/Main/state/roomSpace';
import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { MeetingRoomAddBtn, MeetingRoomMembersWrapper } from './styles';

const MeetingRoomMembers = () => {
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  // 当前用户列表
  const userList = useRecoilValue(
    roomSpaceUserBasicInfoListFamily(selectedRoomId),
  );

  /**
   * 每次进入 MeetingRoom 直接打开所有人的 talking state
   */
  const setUserTalkingList = useSetRecoilState(userTalkingListState);
  useEffect(() => {
    const userUpdates = userList.map(({ id: userId }) => ({
      userId,
      isTalking: true,
    }));
    setUserTalkingList(userUpdates);
  }, [selectedRoomId]);

  const addNewMember = () => {
    console.log(`[MeetingRoomMembers] addNewMember`);
  };

  return (
    <MeetingRoomMembersWrapper>
      {userList.map(({ id, avatar }) => (
        <Avatar key={id}>
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
