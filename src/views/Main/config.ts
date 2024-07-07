// user avatar resources
import user0Avatar from '@/assets/img/user_0.png';
import user1Avatar from '@/assets/img/user_1.png';
import user2Avatar from '@/assets/img/user_2.png';
import user5Avatar from '@/assets/img/user_5.png';
import user9Avatar from '@/assets/img/user_9.png';
import user12Avatar from '@/assets/img/user_12.png';
import user13Avatar from '@/assets/img/user_13.png';
import user14Avatar from '@/assets/img/user_14.png';
import user15Avatar from '@/assets/img/user_15.png';
import user1000Avatar from '@/assets/img/user_1000.png';
import user666Avatar from '@/assets/img/user_666.png';
import graphic1Avatar from '@/assets/img/graphic_1.png';
import graphic2Avatar from '@/assets/img/graphic_2.png';

// room avatar resources
import officeBookAvatar from '@/assets/img/office_book.png';
import officeToolsAvatar from '@/assets/img/office_tools.png';
import officeGraphicsAvatar from '@/assets/img/office_graphics.png';
import officeGitlabAvatar from '@/assets/img/office_gitlab.png';
import coffeeAvatar from '@/assets/img/coffee.png';
import coffeeGymAvatar from '@/assets/img/coffee_gym.png';
import meetingAvatar from '@/assets/img/meeting.png';

// video
import {
  SanVideoUrl,
  JojoVideoUrl,
  LanVideoUrl,
  LeiVideoUrl,
  ShutingVideoUrl,
  TiantianVideoUrl,
  TingtingVideoUrl,
  XinLiuVideoUrl,
  YuHangVideoUrl,
} from '@/common/const';

import { AppType } from '@/components/AppIcon/type';
import { UserState, RoomType } from './state/type';
import { TeamData } from './state/team';
import { RoomData } from './state/room';
import { AllChatRecords, AllRoomSpaceInfo } from './state/roomSpace';

export const initTeamDataList: TeamData[] = [
  {
    id: 'user-07',
    avatar: user1000Avatar,
    name: 'San',
    state: UserState.Idle,
    currentRoomId: 'room-0',
    isGroup: false,
    videoUrl: SanVideoUrl,
  },
  {
    id: 'user-01',
    avatar: user0Avatar,
    name: 'Jojo Zhao',
    state: UserState.Idle,
    currentRoomId: 'room-1',
    isGroup: false,
    videoUrl: JojoVideoUrl,
  },
  {
    id: 'user-08',
    avatar: user1Avatar,
    name: 'Tingting',
    state: UserState.Talking,
    currentRoomId: 'room-5',
    usingApp: AppType.Figma,
    isGroup: false,
    videoUrl: TingtingVideoUrl,
  },
  {
    id: 'user-06',
    avatar: user2Avatar,
    name: 'Xin Liu',
    state: UserState.Busy,
    currentRoomId: 'room-11',
    usingApp: AppType.Notion,
    isGroup: false,
    videoUrl: XinLiuVideoUrl,
  },
  {
    id: 'group-01',
    avatar: graphic1Avatar,
    name: 'Doc PM Group',
    isGroup: true,
  },
  {
    id: 'user-09',
    avatar: user5Avatar,
    name: 'Lan',
    state: UserState.Busy,
    currentRoomId: 'room-5',
    usingApp: AppType.Figma,
    isGroup: false,
    videoUrl: LanVideoUrl,
  },
  {
    id: 'group-02',
    avatar: graphic2Avatar,
    name: 'Project Alpha Group',
    isGroup: true,
  },
  {
    id: 'user-05',
    avatar: user9Avatar,
    name: 'Shu ting',
    state: UserState.Busy,
    currentRoomId: 'room-11',
    usingApp: AppType.Figma,
    isGroup: false,
    videoUrl: ShutingVideoUrl,
  },
  {
    id: 'user-02',
    avatar: user12Avatar,
    name: 'JiaJia',
    state: UserState.Busy,
    currentRoomId: 'room-0',
    usingApp: AppType.Notion,
    isGroup: false,
  },
  {
    id: 'user-03',
    avatar: user13Avatar,
    name: 'Yu hang',
    state: UserState.Busy,
    currentRoomId: 'room-0',
    usingApp: AppType.Figma,
    isGroup: false,
    videoUrl: YuHangVideoUrl,
  },
  {
    id: 'user-04',
    avatar: user14Avatar,
    name: 'Tian tian',
    state: UserState.Busy,
    currentRoomId: 'room-4',
    usingApp: AppType.Pycharm,
    isGroup: false,
    videoUrl: TiantianVideoUrl,
  },
  {
    id: 'user-10',
    avatar: user15Avatar,
    name: 'Lei',
    state: UserState.Busy,
    currentRoomId: 'room-1',
    isGroup: false,
    videoUrl: LeiVideoUrl,
  },
  {
    id: 'group-003',
    avatar: graphic2Avatar,
    name: 'Test 1 - Project Alpha Group LongLongLongLongNmae',
    isGroup: true,
  },
  {
    id: 'group-004',
    avatar: graphic2Avatar,
    name: 'Test 2 - Project Alpha Group LongLongLongLongNmae',
    isGroup: true,
  },
  {
    id: 'user-666',
    avatar: user666Avatar,
    name: 'CEO',
    state: UserState.Idle,
    isGroup: false,
  },
];

export const initRoomDataList: RoomData[] = [
  // {
  //   id: 'room-12',
  //   type: RoomType.TempMeeting,
  //   avatar: meetingTempAvatar,
  //   title: 'Temporary meeting rooms',
  // },
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
  'user-01': [
    {
      userId: 'user-07',
      text: 'I want to find you to understand some of the details of the relevant PRD, it will not be too long',
      createTime: '12:27',
    },
    {
      userId: 'user-01',
      text: "Ok let's talk, I'm at Coffee Bar now, Plz follow me",
      createTime: '12:30',
    },
  ],
  'user-08': [
    {
      userId: 'user-07',
      text: 'How is your design going?',
      createTime: '11:44',
    },
    {
      userId: 'user-08',
      text: 'Not bad, you can take a look at my recent goals on Path, and you can talk about it later',
      createTime: '11:45',
    },
  ],
  'user-06': [
    {
      userId: 'user-07',
      text: 'Hi, are u the PM for Project A?',
      createTime: '11:33',
    },
    {
      userId: 'user-06',
      text: 'Yes, is there any problem?',
      createTime: '11:34',
    },
  ],
  'group-01': [
    {
      userId: 'user-02',
      text: 'Please all PM give the ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?',
      createTime: '14:01',
    },
  ],
  'user-09': [
    {
      userId: 'user-07',
      text: 'This software is so much fun',
      createTime: '11:14',
    },
    {
      userId: 'user-09',
      text: 'Lollllll',
      createTime: '11:15',
    },
  ],
  'user-05': [
    {
      userId: 'user-05',
      text: 'get lunch together?',
      createTime: '10:23',
    },
  ],
  'user-02': [
    {
      userId: 'user-07',
      text: 'I have some questions I would like to consult',
      createTime: '10:11',
    },
    {
      userId: 'user-02',
      text: 'We can have a conversation...',
      createTime: '10:12',
    },
  ],
  'user-03': [
    {
      userId: 'user-07',
      text: "Sorry, I can't go to the afternoon meeting later",
      createTime: '09:33',
    },
    {
      userId: 'user-03',
      text: 'Ok, Thats fine',
      createTime: '09:34',
    },
  ],
  'user-04': [
    {
      userId: 'user-07',
      text: 'Where are you, there is a technical question you would like to ask',
      createTime: '10:54',
    },
    {
      userId: 'user-04',
      text: 'Something is wrong with my computer and I checked it here',
      createTime: '10:55',
    },
  ],
  'user-10': [
    {
      userId: 'user-07',
      text: "I see you this month Objective and feel like there's some place to collaborate",
      createTime: '13:20',
    },
    {
      userId: 'user-10',
      text: 'No problem, wait until I finish updating the code café to see',
      createTime: '13:22',
    },
  ],
};

export const initAllRoomSpaceInfo: AllRoomSpaceInfo = {
  'room-1': [
    {
      id: 'user-01',
      state: UserState.Idle,
      position: [80, 80],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-10',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: true,
    },
  ],
  'room-5': [
    {
      id: 'user-08',
      state: UserState.Talking,
      position: [80, 80],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-09',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: false,
    },
  ],
  'room-11': [
    {
      id: 'user-06',
      state: UserState.Busy,
      position: [80, 80],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-05',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: false,
    },
  ],
  'room-4': [
    {
      id: 'user-04',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: false,
    },
  ],
  'room-0': [
    {
      id: 'user-07',
      state: UserState.Idle,
      position: [150, 150],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-02',
      state: UserState.Busy,
      position: [80, 80],
      isTalking: true,
      mute: false,
    },
    {
      id: 'user-03',
      state: UserState.Busy,
      position: [220, 150],
      isTalking: true,
      mute: false,
    },
  ],
};

export const invitationAcceptList: string[] = [
  'user-06', // Xin Liu
  'user-05', // Shu ting
];

export const collaborateOuterLinkMap: { [type in AppType]: string } = {
  [AppType.Figma]:
    'https://www.figma.com/file/mw5cRyNECoNhYC7HpeAoJ0/%E5%8D%8F%E5%90%8C%E5%B7%A5%E5%85%B7-%E5%81%A5%E5%B0%86',
  [AppType.Notion]:
    'https://joezhao.notion.site/joezhao/Joe-s-Graduation-project-8a539bf4feae4e1eabf778869b2d6033',
  [AppType.Pycharm]: 'https://www.jetbrains.com/pycharm/',
  [AppType.None]: '',
};
