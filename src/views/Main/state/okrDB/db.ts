import { initTeamDataList } from '../../config';
import _userRelTable from './data/userRelTable.json';
import _oTable from './data/oTable.json';
import _oRelTable from './data/oRelTable.json';
import _krTable from './data/krTable.json';
import _projectTable from './data/projectTable.json';
import _projectRelUserTable from './data/projectRelUserTable.json';
import _projectRelKRTable from './data/projectRelKRTable.json';
import _todoTable from './data/todoTable.json';
import _todoRelProjectTable from './data/todoRelProjectTable.json';
import {
  KREntity,
  OEntity,
  ORelEntity,
  ProjectEntity,
  ProjectRelKREntity,
  ProjectRelUserEntity,
  TodoEntity,
  TodoRelProjectEntity,
  UserEntity,
  UserRelEntity,
} from './type';

export const CEO_ID = 'user-666';

/**
 * user 相关（汇报关系）
 */
export const userTable: UserEntity[] = initTeamDataList.map(
  ({ id, avatar, name }) => ({ id, avatar, name }),
);
export const userRelTable: UserRelEntity[] = _userRelTable;

/**
 * O 相关
 */
export const oTable: OEntity[] = _oTable;
export const oRelTable: ORelEntity[] = _oRelTable;

/**
 * KR 相关
 */
export const krTable: KREntity[] = _krTable;

/**
 * Project 相关
 */
// @ts-ignore
export const projectTable: ProjectEntity[] = _projectTable;
// @ts-ignore
export const projectRelUserTable: ProjectRelUserEntity[] = _projectRelUserTable;
export const projectRelKRTable: ProjectRelKREntity[] = _projectRelKRTable;

// @ts-ignore
export const todoTable: TodoEntity[] = _todoTable;
export const todoRelProjectTable: TodoRelProjectEntity[] = _todoRelProjectTable;
