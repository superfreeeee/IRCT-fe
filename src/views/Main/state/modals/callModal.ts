import { atom } from 'recoil';

export const callModalVisibleState = atom<boolean>({
  key: 'callModal_callModalVisible',
  default: false,
});

export interface CallModalInfo {
  avatar: string;
  userId: string;
  userName: string;
  responsed: boolean;
  accept: boolean;
}

export const callModalInfoState = atom<CallModalInfo>({
  key: 'callModal_callModalInfo',
  default: {
    avatar: '',
    userId: '',
    userName: '',
    responsed: false,
    accept: false,
  },
});
