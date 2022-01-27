// ========== enum ==========
export enum ProjectType {
  Product = "产品需求",
  Design = "设计需求",
  Technique = "技术需求",
  Unkonwn = "__ProjectType",
}

export enum ProjectDuty {
  Product = "产品",
  Design = "设计",
  Technique = "技术",
  Unkonwn = "__ProjectDuty",
}

export enum TodoStatus {
  Done = "已完成",
  Incomplete = "未完成",
}

export enum ViewPointType {
  Organization = "organization", // 组织视图
  Personal = "personal", //         个人视图
}

export enum EntityType {
  User = "User",
  O = "O",
  KR = "KR",
  Project = "Project",
  Todo = "Todo",
}

// ========== entity types ==========
export interface UserEntity {
  id: string;
  avatar: string;
  name: string;
}

export interface UserRelEntity {
  userId: string;
  bossId: string;
}

export interface OEntity {
  id: number;
  content: string;
  userId: string;
}

export interface ORelEntity {
  OId: number;
  upperOId: number;
}

export interface KREntity {
  id: number;
  content: string;
  upperOId: number;
}

export interface ProjectEntity {
  id: number;
  name: string;
  type: ProjectType;
}

export interface ProjectRelUserEntity {
  projectId: number;
  userId: string;
  duty: ProjectDuty;
}

export interface ProjectRelKREntity {
  projectId: number;
  KRId: number;
}

export interface TodoEntity {
  id: number;
  ddl: string;
  status: TodoStatus;
  userId: string;
}

export interface TodoRelProjectTable {
  todoId: number;
  projectId: number;
}

export type MergedEntity<E1, E2> = E1 & E2;

// ========== api return types ==========
export interface OrganizationViewPointEntity {
  // common props
  type: EntityType.User | EntityType.O;
  id: string;
  originId: string | number;
  // for user
  avatar?: string;
  name?: string;
  // for O
  content?: string;
}

export interface OrganizationViewPointRelation {
  source: string;
  target: string;
  additional?: boolean;
}

export interface PersonalViewPointEntity {
  // common props
  type: EntityType;
  id: string;
  originId: string | number;
  // for user
  avatar?: string;
  // name?: string;
}

export interface PersonalViewPointRelation {
  source: string;
  target: string;
  additional?: boolean;
}

export type ViewPointSource =
  | {
      type: ViewPointType.Organization;
      entities: OrganizationViewPointEntity[];
      relations: OrganizationViewPointRelation[];
    }
  | {
      type: ViewPointType.Personal;
      entities: PersonalViewPointEntity[];
      relations: PersonalViewPointRelation[];
    };
