import React, { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { selectedRoomIdState } from '@views/Main/state/im';
import { userTalkingListState } from '@views/Main/state/user';
import { roomSpaceUserBasicInfoListFamily } from '@views/Main/state/roomSpace';
import { useInviteToRoom } from '@views/Main/state/hooks';
import { selectUserModalControllerInfoState } from '@views/Main/state/modals/selectUserModal';
import useWaitFor from '@hooks/useWaitFor';
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

  /**
   * 添加新成员
   *   点击展开选人组件
   */
  const addBtnRef = useRef<HTMLDivElement>(null);
  const [selectUserModalControllerInfo, setSelectUserModalControllerInfo] =
    useRecoilState(selectUserModalControllerInfoState);
  const waitingResponseRef = useRef(false);
  const addNewMember = () => {
    const { right, top } = addBtnRef.current.getBoundingClientRect();
    const position = { left: right + 10, top };
    setSelectUserModalControllerInfo({
      visible: true,
      selectable: true,
      position,
      scopeRoomId: `!${selectedRoomId}`,
    });
    waitingResponseRef.current = true;
  };

  const { visible: modalVisible, selectedUserId } =
    selectUserModalControllerInfo;
  const inviteToRoom = useInviteToRoom(selectedRoomId, selectedUserId);
  useWaitFor(
    !modalVisible,
    () => {
      if (selectedUserId) {
        inviteToRoom();
        waitingResponseRef.current = false;
      }
    },
    waitingResponseRef.current,
  );

  return (
    <MeetingRoomMembersWrapper>
      {userList.map(({ id, avatar }) => (
        <Avatar key={id}>
          <img src={avatar} width={'100%'} />
        </Avatar>
      ))}
      <MeetingRoomAddBtn ref={addBtnRef} onClick={addNewMember}>
        <BoxIcon type={BoxIconType.Plus} size={'sm'} />
      </MeetingRoomAddBtn>
    </MeetingRoomMembersWrapper>
  );
};

export default MeetingRoomMembers;
