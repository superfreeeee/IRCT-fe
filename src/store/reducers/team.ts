import { Reducer } from 'redux';

import { UserState } from '@components/StatusPoint/type';

// =============== actions ===============
export enum TeamActionType {
  EnterTeam = 'Team#EnterTeam',
  ExitTeam = 'Team#ExitTeam',
}

export const enterTeamAction = (teamId: string) => {
  return {
    type: TeamActionType.EnterTeam,
    payload: teamId,
  };
};

export const exitTeamAction = () => {
  return {
    type: TeamActionType.ExitTeam,
  };
};

// =============== type ===============
export interface TeamData {
  id: string;
  pinned?: boolean;
  avatar?: string;
  title: string;
  state?: UserState;
  unread?: number;
  usingApp?: string;
}

export interface Team {
  list: TeamData[];
  selected: string;
}

// =============== state ===============
const initTeamState: Team = {
  list: [
    { id: 'user-0', title: 'Joe Zhao', state: UserState.Idle, pinned: true },
    {
      id: 'user-1',
      title: 'Tingting',
      state: UserState.Work,
      usingApp: 'Notion',
      pinned: true,
    },
    { id: 'user-2', title: 'Doc PM Group', pinned: true, unread: 31 },
    { id: 'user-3', title: 'CC 0', state: UserState.Busy, usingApp: 'figma' },
    { id: 'user-4', title: 'Project Beta Group' },
    { id: 'user-5', title: 'Project Alpha Group' },
    { id: 'user-6', title: 'Project Alpha Group LongLongLongLongNmae' },
    { id: 'user-7', title: 'Naiquan Gu', state: UserState.Busy, unread: 3 },
    {
      id: 'user-8',
      title: 'Hang Yu',
      state: UserState.Busy,
      usingApp: 'Pycharm',
    },
    {
      id: 'user-9',
      title: 'Shuting Tang',
      state: UserState.Work,
      usingApp: 'Notion',
    },
  ],
  // TODO recover mock
  selected: '',
  // selected: 'user-0',
};

const teamReducer: Reducer<Team> = (prevState = initTeamState, action) => {
  switch (action.type) {
    case TeamActionType.EnterTeam:
      return { ...prevState, selected: action.payload };
    case TeamActionType.ExitTeam:
      return { ...prevState, selected: '' };
    default:
      return prevState;
  }
};

export default teamReducer;
