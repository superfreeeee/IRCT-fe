import { Reducer } from 'redux';

import { EmojiIconType, EMOJI_PREFIX } from '@components/EmojiIcon';
import { CommonAction } from '../type';

// =============== actions ===============
export enum RoomActionType {
  EnterRoom = 'Room#EnterRoom',
  ExitRoom = 'Room#ExitRoom',
}

export const enterRoomAction = (
  roomId: string
): CommonAction<RoomActionType> => {
  return {
    type: RoomActionType.EnterRoom,
    payload: roomId,
  };
};

export const exitRoomAction = (): CommonAction<RoomActionType> => {
  return {
    type: RoomActionType.ExitRoom,
  };
};

// =============== type ===============

export enum RoomType {
  Office = 'office', // 办公室
  Coffee = 'coffee', // 咖啡间
  Meeting = 'meeting', // 视频会议
  TempMeeting = 'temp-meeting', // 暂时会议
  Other = 'other',
}
export interface RoomData {
  id: string;
  type: RoomType;
  avatar?: string;
  pinned?: boolean;
  title: string;
  member: number;
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
      avatar: `${EMOJI_PREFIX}${EmojiIconType.OfficeChair}`,
      title: 'My Team Office',
      pinned: true,
      member: 4,
    },
    {
      id: 'room-1',
      type: RoomType.Coffee,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Coffee}`,
      title: 'Coffee Room',
      pinned: true,
      member: 3,
    },
    {
      id: 'room-2',
      type: RoomType.Meeting,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Book}`,
      title: 'Meeting Room',
      pinned: true,
      member: 0,
    },
    {
      id: 'room-3',
      type: RoomType.Other,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Golf}`,
      title: 'Gym',
      pinned: true,
      member: 5,
    },
    {
      id: 'room-4',
      type: RoomType.Office,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Wrench}`,
      title: 'IT Office',
      member: 1,
    },
    {
      id: 'room-5',
      type: RoomType.Office,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Pencil}`,
      title: 'Design Office 1',
      member: 9,
    },
    {
      id: 'room-6',
      type: RoomType.Other,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Noodles}`,
      title: ' Dining Room 1 LongLongLongLongName',
      member: 3,
    },
    {
      id: 'room-7',
      type: RoomType.Office,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Man}`,
      title: "Joe's Office",
      member: 1,
    },
    {
      id: 'room-8',
      type: RoomType.Office,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Pencil}`,
      title: 'Design Office 2',
      member: 2,
    },
    {
      id: 'room-9',
      type: RoomType.Meeting,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Computer}`,
      title: 'Engineer Room 1',
      member: 4,
    },
    {
      id: 'room-10',
      type: RoomType.Other,
      avatar: `${EMOJI_PREFIX}${EmojiIconType.Noodles}`,
      title: ' Dining Room 1',
      member: 3,
    },
  ],
  selected: 'room-1',
};

const roomReducer: Reducer<Room, CommonAction<RoomActionType>> = (
  prevState = initRoomState,
  action
) => {
  switch (action.type) {
    case RoomActionType.EnterRoom:
      return { ...prevState, selected: action.payload };

    case RoomActionType.ExitRoom:
      return { ...prevState, selected: '' };

    default:
      return prevState;
  }
};

export default roomReducer;
