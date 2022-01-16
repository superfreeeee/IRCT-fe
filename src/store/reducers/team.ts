import { Reducer } from 'redux';

import { UserState } from '@views/Main/state/user';
import { AppType } from '@components/AppIcon/type';
import { CommonAction } from '../type';
import { RoomActionType } from './room';

// img url
import user0Avatar from '@assets/img/user_0.png';
import user1Avatar from '@assets/img/user_1.png';
import user2Avatar from '@assets/img/user_2.png';
import user5Avatar from '@assets/img/user_5.png';
import user9Avatar from '@assets/img/user_9.png';
import user12Avatar from '@assets/img/user_12.png';
import user13Avatar from '@assets/img/user_13.png';
import user14Avatar from '@assets/img/user_14.png';
import user15Avatar from '@assets/img/user_15.png';
import graphic1Avatar from '@assets/img/graphic_1.png';
import graphic2Avatar from '@assets/img/graphic_2.png';

// =============== actions ===============
export enum TeamActionType {
  UpdateUsersState /**/ = 'Team#UpdateUsersState',
}

type UpdateUsersStateParams = { userId: string; active: boolean }[];
export const updateUsersStateAction = (
  params: UpdateUsersStateParams,
): CommonAction<TeamActionType> => {
  return {
    type: TeamActionType.UpdateUsersState,
    payload: params,
  };
};

// =============== type ===============
export interface TeamData {
  id: string;
  avatar?: string;
  title: string;
  state?: UserState;
  usingApp?: AppType;
  currentRoom?: string;
}

export interface Team {
  list: TeamData[];
  selected: string;
}

// =============== state ===============
const initTeamState: Team = {
  list: [
    {
      id: 'user-0',
      avatar: user0Avatar,
      title: 'Jojo Zhao',
      state: UserState.Idle,
      currentRoom: 'room-1',
    },
    {
      id: 'user-1',
      avatar: user1Avatar,
      title: 'Tingting',
      state: UserState.Talking,
      currentRoom: 'room-5',
      usingApp: AppType.Figma,
    },
    {
      id: 'user-2',
      avatar: user2Avatar,
      title: 'Xin Liu',
      state: UserState.Busy,
      currentRoom: 'room-11',
      usingApp: AppType.Notion,
    },
    {
      id: 'user-3',
      avatar: graphic1Avatar,
      title: 'Doc PM Group',
    },
    {
      id: 'user-5',
      avatar: user5Avatar,
      title: 'Lan',
      state: UserState.Busy,
      currentRoom: 'room-5',
      usingApp: AppType.Figma,
    },
    {
      id: 'user-4',
      avatar: graphic2Avatar,
      title: 'Project Alpha Group',
    },
    {
      id: 'user-9',
      avatar: user9Avatar,
      title: 'Shu ting',
      state: UserState.Busy,
      currentRoom: 'room-11',
      usingApp: AppType.Figma,
    },
    {
      id: 'user-12',
      avatar: user12Avatar,
      title: 'JiaJia',
      state: UserState.Busy,
      currentRoom: 'room-0',
      usingApp: AppType.Notion,
    },
    {
      id: 'user-13',
      avatar: user13Avatar,
      title: 'Yu hang',
      state: UserState.Busy,
      currentRoom: 'room-0',
      usingApp: AppType.Figma,
    },
    {
      id: 'user-14',
      avatar: user14Avatar,
      title: 'Tian tian',
      state: UserState.Busy,
      currentRoom: 'room-4',
      usingApp: AppType.Pycharm,
    },
    {
      id: 'user-15',
      avatar: user15Avatar,
      title: 'Lei',
      state: UserState.Busy,
      currentRoom: 'room-1',
    },
    {
      id: 'user-6',
      avatar: graphic2Avatar,
      title: 'Test 1 - Project Alpha Group LongLongLongLongNmae',
    },
    {
      id: 'user-10',
      avatar: graphic2Avatar,
      title: 'Test 2 - Project Alpha Group LongLongLongLongNmae',
    },
    {
      id: 'user-11',
      avatar: graphic2Avatar,
      title: 'Test 3 - Noise User with LongLongLongLongNmae',
      state: UserState.Talking,
    },
  ],
  // TODO recover mock
  selected: '',
  // selected: 'user-0',
};

const updateUsersState = (
  prevState: Team,
  usersActiveStates: UpdateUsersStateParams,
) => {
  // TODO clear console
  // console.log(`usersActiveStates`, usersActiveStates);
  return prevState;
};

const teamReducer: Reducer<
  Team,
  CommonAction<TeamActionType | RoomActionType>
> = (prevState = initTeamState, action): Team => {
  switch (action.type) {
    case TeamActionType.UpdateUsersState:
      return updateUsersState(prevState, action.payload);

    default:
      return prevState;
  }
};

export default teamReducer;
