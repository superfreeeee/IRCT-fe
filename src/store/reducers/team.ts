import { UserState } from '@components/StatusPoint/type';
import { Reducer } from 'redux';

export interface Team {
  list: TeamData[];
  selected: number; // selectedIndex
}

interface TeamData {
  pinned?: boolean;
  title: string;
  state?: UserState;
  unread?: number;
  usingApp?: string;
}

const initTeamState: Team = {
  list: [
    { title: 'Joe Zhao', state: UserState.Idle, pinned: true },
    {
      title: 'Tingting',
      state: UserState.Work,
      usingApp: 'Notion',
      pinned: true,
    },
    { title: 'Doc PM Group', pinned: true, unread: 31 },
    { title: 'CC 0', state: UserState.Busy, usingApp: 'figma' },
    { title: 'Project Beta Group' },
    { title: 'Project Alpha Group' },
    { title: 'Project Alpha Group LongLongLongLongNmae' },
    { title: 'Naiquan Gu', state: UserState.Busy, unread: 3 },
    { title: 'Hang Yu', state: UserState.Busy, usingApp: 'Pycharm' },
    { title: 'Shuting Tang', state: UserState.Work, usingApp: 'Notion' },
  ],
  selected: -1,
};

const teamReducer: Reducer<Team> = (prevState = initTeamState, action) => {
  return prevState;
};

export default teamReducer;
