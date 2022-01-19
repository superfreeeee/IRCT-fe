import { atom } from 'recoil';

export const createMeetingModalVisibleState = atom<boolean>({
  key: 'createMeetingModal_createMeetingModalVisible',
  default: false,
});

export interface CreateMeetingModalInfo {
  roomId: string;
}
export const createMeetingModalInfoState = atom<CreateMeetingModalInfo>({
  key: 'createMeetingModal_createMeetingModalInfo',
  default: {
    roomId: '',
  },
});
