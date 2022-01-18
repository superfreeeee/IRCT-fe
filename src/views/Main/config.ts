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

import { AppType } from '@components/AppIcon/type';
import { UserState, RoomType } from './state/type';
import { TeamData } from './state/team';
import { RoomData } from './state/room';
import { AllChatRecords, AllRoomSpaceInfo } from './state/roomSpace';

export const initTeamDataList: TeamData[] = [
  {
    id: 'user-1000',
    avatar: user1000Avatar,
    name: 'San',
    state: UserState.Idle,
    currentRoomId: 'room-0',
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
    // usingApp: AppType.Notion,
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

export const initAllChatRecords: AllChatRecords = {
  'user-0': [
    {
      userId: 'user-1000',
      text: 'I want to find you to understand some of the details of the relevant PRD, it will not be too long',
      createTime: '12:27',
    },
    {
      userId: 'user-0',
      text: "Ok let's talk, I'm at Coffee Bar now, Plz follow me",
      createTime: '12:30',
    },
  ],
  'user-1': [
    {
      userId: 'user-1000',
      text: 'How is your design going?',
      createTime: '11:44',
    },
    {
      userId: 'user-1',
      text: 'Not bad, you can take a look at my recent goals on Path, and you can talk about it later',
      createTime: '11:45',
    },
  ],
  'user-2': [
    {
      userId: 'user-1000',
      text: 'Hi, are u the PM for Project A?',
      createTime: '11:33',
    },
    {
      userId: 'user-2',
      text: 'Yes, is there any problem?',
      createTime: '11:34',
    },
  ],
  'user-3': [
    {
      userId: 'user-12',
      text: 'Please all PM give the ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?',
      createTime: '14:01',
    },
  ],
  'user-5': [
    {
      userId: 'user-1000',
      text: 'This software is so much fun',
      createTime: '11:14',
    },
    {
      userId: 'user-5',
      text: 'Lollllll',
      createTime: '11:15',
    },
  ],
  'user-9': [
    {
      userId: 'user-9',
      text: 'get lunch together?',
      createTime: '10:23',
    },
  ],
  'user-12': [
    {
      userId: 'user-1000',
      text: 'I have some questions I would like to consult',
      createTime: '10:11',
    },
    {
      userId: 'user-12',
      text: 'We can have a conversation...',
      createTime: '10:12',
    },
  ],
  'user-13': [
    {
      userId: 'user-1000',
      text: "Sorry, I can't go to the afternoon meeting later",
      createTime: '09:33',
    },
    {
      userId: 'user-13',
      text: 'Ok, Thats fine',
      createTime: '09:34',
    },
  ],
  'user-14': [
    {
      userId: 'user-1000',
      text: 'Where are you, there is a technical question you would like to ask',
      createTime: '10:54',
    },
    {
      userId: 'user-14',
      text: 'Something is wrong with my computer and I checked it here',
      createTime: '10:55',
    },
  ],
  'user-15': [
    {
      userId: 'user-1000',
      text: "I see you this month Objective and feel like there's some place to collaborate",
      createTime: '13:20',
    },
    {
      userId: 'user-15',
      text: 'No problem, wait until I finish updating the code café to see',
      createTime: '13:22',
    },
  ],
};

export const initAllRoomSpaceInfo: AllRoomSpaceInfo = {
  'room-1': [
    {
      id: 'user-0',
      state: UserState.Idle,
      position: [80, 80],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-15',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: true,
    },
  ],
  'room-5': [
    {
      id: 'user-1',
      state: UserState.Talking,
      position: [80, 80],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-5',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: false,
    },
  ],
  'room-11': [
    {
      id: 'user-2',
      state: UserState.Busy,
      position: [80, 80],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-9',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: false,
    },
  ],
  'room-4': [
    {
      id: 'user-14',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: false,
    },
  ],
  'room-0': [
    {
      id: 'user-1000',
      state: UserState.Idle,
      position: [150, 150],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-12',
      state: UserState.Busy,
      position: [80, 80],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-13',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: false,
    },
  ],
};
