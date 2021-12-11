import { TabOption } from '../IM/type';

export enum RoomSpaceType {
  Room = 'room',
  Chat = 'chat',
}

export type TabOption2RoomSpaceTypeMapper = {
  [option in TabOption]: RoomSpaceType;
};
