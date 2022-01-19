import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import useCheckbox from '@hooks/useCheckBox';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import {
  createMeetingModalInfoState,
  createMeetingModalVisibleState,
} from '../../state/modals/createMeetingModal';
import { RoomData, roomDataFamily } from '../../state/room';
import {
  CreateMeetingBody,
  CreateMeetingBtn,
  CreateMeetingContainer,
  CreateMeetingHeader,
  CreateMeetingOptions,
} from './styles';
import { RoomType } from '../../state/type';

import meetingAvatar from '@assets/img/meeting.png';

const CreateMeetingModal = () => {
  const [visible, setVisible] = useRecoilState(createMeetingModalVisibleState);
  const { roomId } = useRecoilValue(createMeetingModalInfoState);

  // local state
  const [title, onTitleChange] = useInput();
  const [unlocked, onUnlockedChange] = useCheckbox();

  const description = `You will be upgrading a temporary discussion group to a permanent meeting room. please enter a name and select whether the meeting room can be searched by everyone in the organization`;

  const cancel = () => {
    setVisible(false);
  };

  const setRoomData = useSetRecoilState(roomDataFamily(roomId));
  const persistTempMeeting = () => {
    console.log(`persistTempMeeting(roomId = ${roomId})`);
    const roomData: RoomData = {
      id: roomId,
      type: RoomType.Meeting,
      avatar: meetingAvatar,
      title: title || 'New Meeting Room',
      locked: !unlocked,
    };
    console.table(roomData);
    setRoomData(roomData);
    setVisible(false);
  };

  return (
    <Modal visible={visible}>
      <CreateMeetingContainer>
        <CreateMeetingHeader>
          Creating a Permanent Conference Room
        </CreateMeetingHeader>
        <CreateMeetingBody>
          <div className="description">{description}</div>
          <label htmlFor="room-name" className="field title">
            Name:{' '}
            <input
              id="room-name"
              type="text"
              placeholder="Please enter a room name"
              value={title}
              onChange={onTitleChange}
            />
          </label>
          <div className="field locked">
            Visible to everyone
            <label htmlFor="locked">
              <input
                id="locked"
                type="checkbox"
                checked={unlocked}
                onChange={onUnlockedChange}
              />
              <div className="box"></div>
            </label>
          </div>
          <CreateMeetingOptions>
            <CreateMeetingBtn onClick={cancel}>Cancel</CreateMeetingBtn>
            <CreateMeetingBtn className="primary" onClick={persistTempMeeting}>
              Yes
            </CreateMeetingBtn>
          </CreateMeetingOptions>
        </CreateMeetingBody>
      </CreateMeetingContainer>
    </Modal>
  );
};

export default CreateMeetingModal;
