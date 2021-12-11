import { Reducer } from 'redux';

import { TabOption } from '@views/Main/IM/type';

// =============== actions ===============
export enum SpaceActionType {
  SwitchSpace,
  ToggleSpaceVisible,
}

export const switchSpaceAction = (space: TabOption) => {
  return {
    type: SpaceActionType.SwitchSpace,
    payload: space,
  };
};

export const toggleSpaceVisibleAction = () => {
  return {
    type: SpaceActionType.ToggleSpaceVisible,
  };
};

// =============== type ===============
export interface Space {
  visible: boolean;
  currentSpace: TabOption;
}

// =============== state ===============
const initSpaceState: Space = {
  visible: true,
  currentSpace: TabOption.Team,
};

const spaceReducer: Reducer<Space> = (prevState = initSpaceState, action) => {
  switch (action.type) {
    case SpaceActionType.SwitchSpace:
      return { ...prevState, currentSpace: action.payload };
    case SpaceActionType.ToggleSpaceVisible:
      return { ...prevState, visible: !prevState.visible };
    default:
      return prevState;
  }
};

export default spaceReducer;
