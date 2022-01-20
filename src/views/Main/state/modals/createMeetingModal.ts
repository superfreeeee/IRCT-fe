import { atom } from 'recoil';
import { StateNamespace } from '../type';
import { createPrefixer } from '../utils';

const prefixer = createPrefixer(StateNamespace.CreateMeetingModal);

export const createMeetingModalVisibleState = atom<boolean>({
  key: prefixer('createMeetingModalVisible'),
  default: false,
});

export interface CreateMeetingModalInfo {
  roomId: string;
}
export const createMeetingModalInfoState = atom<CreateMeetingModalInfo>({
  key: prefixer('createMeetingModalInfo'),
  default: {
    roomId: '',
  },
});
