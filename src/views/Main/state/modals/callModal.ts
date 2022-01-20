import { atom } from 'recoil';
import { StateNamespace } from '../type';
import { createPrefixer } from '../utils';

const prefixer = createPrefixer(StateNamespace.CallModal);

export const callModalVisibleState = atom<boolean>({
  key: prefixer('callModalVisible'),
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
  key: prefixer('callModalInfo'),
  default: {
    avatar: '',
    userId: '',
    userName: '',
    responsed: false,
    accept: false,
  },
});
