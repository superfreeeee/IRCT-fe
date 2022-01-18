// ========== enum 枚举类型 ==========
export enum TabOption {
  Room = 'Room',
  Team = 'Team',
  None = 'None',
}

export enum UserState {
  Idle = 'idle',
  Busy = 'busy',
  Talking = 'talking',
  Unknown = 'unknown',
}

export enum RoomType {
  Office = 'office',
  Coffee = 'coffee',
  Meeting = 'meeting',
  TempMeeting = 'temp-meeting',
  None = 'none',
}

export enum VideoVoiceRate {
  LEVEL1 = 100,
  LEVEL2 = 60,
  LEVEL3 = 20,
  LEVEL4 = 0,
}

// ========== type / interface 对象类型 ==========
export type RoomSpacePosition = [number, number];

export interface UserBasicInfo {
  id: string;
  avatar: string;
  name: string;
  isGroup: boolean;
  videoUrl?: string;
}

export interface UserRoomSpaceInfo {
  id: string;
  state: UserState;
  position: RoomSpacePosition;
  isTalking: boolean; // 加入某个对话
  mute: boolean;
}

export interface UserRoomSpaceFigure extends UserRoomSpaceInfo, UserBasicInfo {}

export interface VideoRoomFigure extends UserRoomSpaceFigure {
  voiceRate: VideoVoiceRate;
}
