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

export interface EnterRoomParams {
  room: RoomData;
  followee?: string; // target userId
}
export const enterRoomAction = (
  params: EnterRoomParams,
): CommonAction<RoomActionType> => {
  return {
    type: RoomActionType.EnterRoom,
    payload: params,
  };
};

export const exitRoomAction = (
  reserveSpace: boolean = false,
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
  followee: string;
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
  ],
  selected: 'room-0',
  followee: '',
};

const enterRoom = (
  prevState: Room,
  { room: { id }, followee = '' }: EnterRoomParams,
): Room => {
  return {
    ...prevState,
    selected: id,
    followee,
  };
};

const roomReducer: Reducer<
  Room,
  CommonAction<RoomActionType | TeamActionType>
> = (prevState = initRoomState, action): Room => {
  switch (action.type) {
    case RoomActionType.EnterRoom:
      return enterRoom(prevState, action.payload);

    case RoomActionType.ExitRoom:
      return { ...prevState, selected: '' };

    default:
      return prevState;
  }
};

export default roomReducer;
