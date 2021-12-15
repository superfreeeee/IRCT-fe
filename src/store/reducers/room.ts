import { Reducer } from 'redux';

// =============== actions ===============
export enum RoomActionType {
  EnterRoom = 'Room#EnterRoom',
  ExitRoom = 'Room#ExitRoom',
}

export const enterRoomAction = (roomId: string) => {
  return {
    type: RoomActionType.EnterRoom,
    payload: roomId,
  };
};

export const exitRoomAction = () => {
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
      title: 'My Team Office',
      pinned: true,
      member: 4,
    },
    {
      id: 'room-1',
      type: RoomType.Coffee,
      title: 'Coffee Room',
      pinned: true,
      member: 3,
    },
    {
      id: 'room-2',
      type: RoomType.Meeting,
      title: 'Meeting Room',
      pinned: true,
      member: 0,
    },
    {
      id: 'room-3',
      type: RoomType.Other,
      title: 'Gym',
      pinned: true,
      member: 5,
    },
    { id: 'room-4', type: RoomType.Office, title: 'IT Office', member: 1 },
    {
      id: 'room-5',
      type: RoomType.Office,
      title: 'Design Office 1',
      member: 9,
    },
    {
      id: 'room-6',
      type: RoomType.Other,
      title: ' Dining Room 1 LongLongLongLongName',
      member: 3,
    },
    { id: 'room-7', type: RoomType.Office, title: "Joe's Office", member: 1 },
    {
      id: 'room-8',
      type: RoomType.Office,
      title: 'Design Office 2',
      member: 2,
    },
    {
      id: 'room-9',
      type: RoomType.Meeting,
      title: 'Engineer Room 1',
      member: 4,
    },
    { id: 'room-10', type: RoomType.Other, title: ' Dining Room 1', member: 3 },
  ],
  selected: '',
};

const roomReducer: Reducer<Room> = (prevState = initRoomState, action) => {
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
