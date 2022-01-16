import { AppType } from '@components/AppIcon/type';
import { UserState } from '@components/StatusPoint/type';
import { atom } from 'recoil';

export const stateTooltipVisibleState = atom({
  key: 'im_stateTooltipVisible',
  default: false,
});

export interface StateTooltipInfo {
  position: {
    left: number;
    top: number;
  };
  state: UserState;
  room?: string;
  usingApp?: AppType;
}

export const stateTooltipInfoState = atom<StateTooltipInfo>({
  key: 'im_stateTooltipInfo',
  default: {
    position: { left: 215, top: 112 },
    state: UserState.Idle,
  },
});
