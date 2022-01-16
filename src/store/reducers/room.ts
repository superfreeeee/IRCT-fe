import { Reducer } from 'redux';

import { RoomType } from '@views/Main/state/room';
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
import meetingTempAvatar from '@assets/img/meeting_temp.png';

// =============== actions ===============
export enum RoomActionType {
  ToggleMeetingRoomLock /*...*/ = 'Room#ToggleMeetingRoomLock',
  PersistTempMeetingAction /**/ = 'Room#PersistTempMeetingAction',
}

export interface EnterRoomParams {
  room: RoomData;
  followee?: string; // target userId
}

export const toggleMeetingRoomLockAction = (
  roomId: string,
): CommonAction<RoomActionType> => {
  return {
    type: RoomActionType.ToggleMeetingRoomLock,
    payload: roomId,
  };
};

export const persistTempMeetingAction = (roomId: string) => {
  return {
    type: RoomActionType.PersistTempMeetingAction,
    payload: roomId,
  };
};

// =============== type ===============
export interface RoomData {
  id: string;
  type: RoomType;
  avatar?: string;
  title: string;
  locked?: boolean;
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
  ],
  selected: 'room-0',
  followee: '',
};

const toggleMeetingRoomLock = (prevState: Room, roomId: string): Room => {
  const prevRooms = prevState.list;
  const targetRoomIndex = prevRooms.findIndex((room) => room.id === roomId);
  // check if room exists
  if (targetRoomIndex < 0) {
    return prevState;
  }
  const targetRoom = prevRooms[targetRoomIndex];
  // assert room type is Meeting
  if (targetRoom.type !== RoomType.Meeting) {
    return prevState;
  }
  return {
    ...prevState,
    list: [
      ...prevRooms.slice(0, targetRoomIndex),
      {
        ...targetRoom,
        locked: !targetRoom.locked,
      },
      ...prevRooms.slice(targetRoomIndex + 1),
    ],
  };
};

const persistTempMeeting = (prevState: Room, roomId: string): Room => {
  const prevRooms = prevState.list;
  const targetRoomIndex = prevRooms.findIndex((room) => room.id === roomId);
  // check if room exists
  if (targetRoomIndex < 0) {
    return prevState;
  }
  const targetRoom = prevRooms[targetRoomIndex];
  // assert room type is TempMeeting
  if (targetRoom.type !== RoomType.TempMeeting) {
    return prevState;
  }
  return {
    ...prevState,
    list: [
      ...prevRooms.slice(0, targetRoomIndex),
      {
        ...targetRoom,
        avatar: meetingAvatar,
        type: RoomType.Meeting,
      },
      ...prevRooms.slice(targetRoomIndex + 1),
    ],
  };
};

const roomReducer: Reducer<
  Room,
  CommonAction<RoomActionType | TeamActionType>
> = (prevState = initRoomState, action): Room => {
  switch (action.type) {
    case RoomActionType.ToggleMeetingRoomLock:
      return toggleMeetingRoomLock(prevState, action.payload);

    case RoomActionType.PersistTempMeetingAction:
      return persistTempMeeting(prevState, action.payload);

    default:
      return prevState;
  }
};

export default roomReducer;
