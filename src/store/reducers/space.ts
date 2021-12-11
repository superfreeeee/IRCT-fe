import { Reducer } from 'redux';

import { TabOption } from '@views/Main/IM/type';

// =============== actions ===============
export enum SpaceActionType {
  SwitchSpace,
}

export const switchSpaceAction = (space: TabOption) => {
  return {
    type: SpaceActionType.SwitchSpace,
    payload: space,
  };
};

// =============== type ===============
export interface Space {
  visible: boolean;
  currentSpace: TabOption;
}

// =============== state ===============
const initSpaceState: Space = {
  visible: false,
  currentSpace: TabOption.Team,
};

const spaceReducer: Reducer<Space> = (prevState = initSpaceState, action) => {
  switch (action.type) {
    case SpaceActionType.SwitchSpace:
      return { ...prevState, currentSpace: action.payload };
    default:
      return prevState;
  }
};

export default spaceReducer;