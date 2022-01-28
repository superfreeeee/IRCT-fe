import { ViewPointType } from './okrDB/type';

export enum StateNamespace {
  IM = 'im',
  User = 'user',
  Room = 'room',
  Team = 'team',
  Space = 'roomSpace',
  AppSidebar = 'appSidebar',
  OKRPath = 'okrPath',

  CallModal = 'callModal',
  CreateMeetingModal = 'createMeetingModal',
  SelectUserModal = 'selectUserModal',
}

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
  LEVEL3 = 15,
  LEVEL4 = 0,
}

export enum ViewPointStackActionType {
  Clear = 'clear',
  Push = 'push',
  Pop = 'pop',
  Null = 'null',
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

/**
 * 观察视图纪录
 */
export interface ViewPointRecord {
  type: ViewPointType;
  centerUserId?: string;
}

/**
 * 操作观察视图纪录方法
 */
export interface ViewPointStackAction {
  type: ViewPointStackActionType;
  record?: ViewPointRecord;
}

export interface PathTooltipPosition {
  left: number;
  bottom: number;
}
