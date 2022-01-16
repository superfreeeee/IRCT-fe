import user0Avatar from '@assets/img/user_0.png';
import user1Avatar from '@assets/img/user_1.png';
import user2Avatar from '@assets/img/user_2.png';
import user5Avatar from '@assets/img/user_5.png';
import user9Avatar from '@assets/img/user_9.png';
import user12Avatar from '@assets/img/user_12.png';
import user13Avatar from '@assets/img/user_13.png';
import user14Avatar from '@assets/img/user_14.png';
import user15Avatar from '@assets/img/user_15.png';
import user1000Avatar from '@assets/img/user_1000.png';
import graphic1Avatar from '@assets/img/graphic_1.png';
import graphic2Avatar from '@assets/img/graphic_2.png';

import officeBookAvatar from '@assets/img/office_book.png';
import officeToolsAvatar from '@assets/img/office_tools.png';
import officeGraphicsAvatar from '@assets/img/office_graphics.png';
import officeGitlabAvatar from '@assets/img/office_gitlab.png';
import coffeeAvatar from '@assets/img/coffee.png';
import coffeeGymAvatar from '@assets/img/coffee_gym.png';
import meetingAvatar from '@assets/img/meeting.png';
import meetingTempAvatar from '@assets/img/meeting_temp.png';

import { UserState } from '@views/Main/state/user';
import { AppType } from '@components/AppIcon/type';
import { TeamData } from './state/team';
import { RoomData, RoomType } from './state/room';

export const initTeamDataList: TeamData[] = [
  {
    id: 'user-1000',
    avatar: user1000Avatar,
    name: 'San',
    state: UserState.Idle,
    isGroup: false,
  },
  {
    id: 'user-0',
    avatar: user0Avatar,
    name: 'Jojo Zhao',
    state: UserState.Idle,
    currentRoomId: 'room-1',
    isGroup: false,
  },
  {
    id: 'user-1',
    avatar: user1Avatar,
    name: 'Tingting',
    state: UserState.Talking,
    currentRoomId: 'room-5',
    usingApp: AppType.Figma,
    isGroup: false,
  },
  {
    id: 'user-2',
    avatar: user2Avatar,
    name: 'Xin Liu',
    state: UserState.Busy,
    currentRoomId: 'room-11',
    usingApp: AppType.Notion,
    isGroup: false,
  },
  {
    id: 'user-3',
    avatar: graphic1Avatar,
    name: 'Doc PM Group',
    isGroup: true,
  },
  {
    id: 'user-5',
    avatar: user5Avatar,
    name: 'Lan',
    state: UserState.Busy,
    currentRoomId: 'room-5',
    usingApp: AppType.Figma,
    isGroup: false,
  },
  {
    id: 'user-4',
    avatar: graphic2Avatar,
    name: 'Project Alpha Group',
    isGroup: true,
  },
  {
    id: 'user-9',
    avatar: user9Avatar,
    name: 'Shu ting',
    state: UserState.Busy,
    currentRoomId: 'room-11',
    usingApp: AppType.Figma,
    isGroup: false,
  },
  {
    id: 'user-12',
    avatar: user12Avatar,
    name: 'JiaJia',
    state: UserState.Busy,
    currentRoomId: 'room-0',
    usingApp: AppType.Notion,
    isGroup: false,
  },
  {
    id: 'user-13',
    avatar: user13Avatar,
    name: 'Yu hang',
    state: UserState.Busy,
    currentRoomId: 'room-0',
    usingApp: AppType.Figma,
    isGroup: false,
  },
  {
    id: 'user-14',
    avatar: user14Avatar,
    name: 'Tian tian',
    state: UserState.Busy,
    currentRoomId: 'room-4',
    usingApp: AppType.Pycharm,
    isGroup: false,
  },
  {
    id: 'user-15',
    avatar: user15Avatar,
    name: 'Lei',
    state: UserState.Busy,
    currentRoomId: 'room-1',
    isGroup: false,
  },
  {
    id: 'user-6',
    avatar: graphic2Avatar,
    name: 'Test 1 - Project Alpha Group LongLongLongLongNmae',
    isGroup: true,
  },
  {
    id: 'user-10',
    avatar: graphic2Avatar,
    name: 'Test 2 - Project Alpha Group LongLongLongLongNmae',
    isGroup: true,
  },
  {
    id: 'user-11',
    avatar: graphic2Avatar,
    name: 'Test 3 - Noise User with LongLongLongLongNmae',
    state: UserState.Talking,
    isGroup: false,
  },
];

export const initRoomDataList: RoomData[] = [
  {
    id: 'room-12',
    type: RoomType.TempMeeting,
    avatar: meetingTempAvatar,
    title: 'Temporary meeting rooms',
  },
  {
    id: 'room-0',
    type: RoomType.Office,
    avatar: officeBookAvatar,
    title: 'PM Office',
  },
  {
    id: 'room-1',
    type: RoomType.Coffee,
    avatar: coffeeAvatar,
    title: 'Coffee Bar',
  },
  {
    id: 'room-2',
    type: RoomType.Meeting,
    avatar: meetingAvatar,
    title: 'Meeting Room 1',
    locked: false,
  },
  {
    id: 'room-3',
    type: RoomType.Coffee,
    avatar: coffeeGymAvatar,
    title: 'Gym',
  },
  {
    id: 'room-4',
    type: RoomType.Office,
    avatar: officeToolsAvatar,
    title: 'IT Office',
  },
  {
    id: 'room-5',
    type: RoomType.Office,
    avatar: officeGraphicsAvatar,
    title: 'Design Office 1',
  },
  {
    id: 'room-11',
    type: RoomType.Office,
    avatar: officeGitlabAvatar,
    title: 'RD Office 1',
  },
  {
    id: 'room-8',
    type: RoomType.Meeting,
    avatar: meetingAvatar,
    title: 'Design Office 2',
    locked: true,
  },
];
