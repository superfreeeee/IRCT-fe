import { CommonAction } from '@store/type';
import { TabOption } from '@views/Main/IM/type';
import { Reducer } from 'redux';

// =============== actions ===============
export enum IMActionType {
  SwitchTab = 'IM#SwitchTab',
}

export const switchTabAction = (tab: TabOption): CommonAction<IMActionType> => {
  return {
    type: IMActionType.SwitchTab,
    payload: tab,
  };
};

// =============== type ===============
export interface IM {
  currentTab: TabOption;
}

// =============== state ===============
const initIMState: IM = {
  currentTab: TabOption.Team,
};

const imReducer: Reducer<IM, CommonAction<IMActionType>> = (
  prevState = initIMState,
  action
): IM => {
  switch (action.type) {
    case IMActionType.SwitchTab:
      return { ...prevState, currentTab: action.payload };
    default:
      return prevState;
  }
};

export default imReducer;
