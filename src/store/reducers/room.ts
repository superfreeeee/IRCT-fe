import { Reducer } from 'redux';

import { CommonAction } from '../type';
import { TeamActionType } from './team';

// imgs
import officeBookAvatar from '@assets/img/office_book.png';
import officeToolsAvatar from '@assets/img/office_tools.png';
import officeGraphicsAvatar from '@assets/img/office_graphics.png';
import officeGitlabAvatar from '@assets/img/office_gitlab.png';
import coffeeAvatar from '@assets/img/coffee.png';
import coffeeGymAvatar from '@assets/img/coffee_gym.png';
import meetingAvatar from '@assets/img/meeting.png';

// =============== actions ===============
export enum RoomActionType {
  EnterRoom /*.*/ = 'Room#EnterRoom',
  ExitRoom /*..*/ = 'Room#ExitRoom',
}

export const enterRoomAction = (
  room: RoomData
): CommonAction<RoomActionType> => {
  return {
    type: RoomActionType.EnterRoom,
    payload: room,
  };
};

export const exitRoomAction = (
  reserveSpace: boolean = false
): CommonAction<RoomActionType> => {
  return {
    type: RoomActionType.ExitRoom,
    payload: reserveSpace,
  };
};

// =============== type ===============

export enum RoomType {
  Office = 'office', // 办公室
  Coffee = 'coffee', // 咖啡间
  Meeting = 'meeting', // 视频会议
  TempMeeting = 'temp-meeting', // 暂时会议
  None = 'none',
}

export interface RoomData {
  id: string;
  type: RoomType;
  avatar?: string;
  title: string;
}

export interface Room {
  list: RoomData[];
  selected: string;
}

// =============== state ===============
const initRoomState: Room = {
  list: [
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
    },
    // {
    //   id: 'room-6',
    //   type: RoomType.Other,
    //   avatar: `${EMOJI_PREFIX}${EmojiIconType.Noodles}`,
    //   title: ' Dining Room 1 LongLongLongLongName',
    //   member: 3,
    // },
    // {
    //   id: 'room-7',
    //   type: RoomType.Office,
    //   avatar: `${EMOJI_PREFIX}${EmojiIconType.Man}`,
    //   title: "Joe's Office",
    //   member: 1,
    // },
    // {
    //   id: 'room-9',
    //   type: RoomType.Meeting,
    //   avatar: `${EMOJI_PREFIX}${EmojiIconType.Computer}`,
    //   title: 'Engineer Room 1',
    //   member: 4,
    // },
    // {
    //   id: 'room-10',
    //   type: RoomType.Other,
    //   avatar: `${EMOJI_PREFIX}${EmojiIconType.Noodles}`,
    //   title: ' Dining Room 1',
    //   member: 3,
    // },
  ],
  selected: 'room-1',
};

const roomReducer: Reducer<
  Room,
  CommonAction<RoomActionType | TeamActionType>
> = (prevState = initRoomState, action): Room => {
  switch (action.type) {
    case RoomActionType.EnterRoom:
      return {
        ...prevState,
        selected: (action.payload as RoomData).id,
      };

    case RoomActionType.ExitRoom:
      return { ...prevState, selected: '' };

    default:
      return prevState;
  }
};

export default roomReducer;
