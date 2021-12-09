import { Reducer } from 'redux';

export interface Room {
  list: RoomData[];
  selected: number; // selectedIndex
}

export enum RoomType {
  Office = 'office', // 办公室
  Coffee = 'coffee', // 咖啡间
  Meeting = 'meeting', // 视频会议
  TempMeeting = 'temp-meeting', // 暂时会议
  Other = 'other',
}

interface RoomData {
  type: RoomType;
  pinned?: boolean;
  title: string;
  member: number;
}

const initRoomState: Room = {
  list: [
    { type: RoomType.Office, title: 'My Team Office', pinned: true, member: 4 },
    { type: RoomType.Coffee, title: 'Coffee Room', pinned: true, member: 3 },
    { type: RoomType.Meeting, title: 'Meeting Room', pinned: true, member: 0 },
    { type: RoomType.Other, title: 'Gym', pinned: true, member: 5 },
    { type: RoomType.Office, title: 'IT Office', member: 1 },
    { type: RoomType.Office, title: 'Design Office 1', member: 9 },
    {
      type: RoomType.Other,
      title: ' Dining Room 1 LongLongLongLongName',
      member: 3,
    },
    { type: RoomType.Office, title: "Joe's Office", member: 1 },
    { type: RoomType.Office, title: 'Design Office 2', member: 2 },
    { type: RoomType.Meeting, title: 'Engineer Room 1', member: 4 },
    { type: RoomType.Other, title: ' Dining Room 1', member: 3 },
  ],
  selected: -1,
};

const roomReducer: Reducer<Room> = (prevState = initRoomState, action) => {
  return prevState;
};

export default roomReducer;
