import { getORelUserMapper, getUserRelOMapper } from './api';
import {
  krTable,
  oRelTable,
  oTable,
  projectRelKRTable,
  projectRelUserTable,
  projectTable,
  todoRelProjectTable,
  todoTable,
} from './db';
import {
  EditOPayload,
  EditProjectPayload,
  KREntity,
  AddOPayload,
  ORelEntity,
  AddProjectPayload,
  AddTodoPayload,
  ProjectRelUserEntity,
  ProjectDuty,
  TodoEntity,
  EditTodoPayload,
  OEntity,
  EditKRPayload,
  AddKRPayload,
  ProjectEntity,
  ProjectRelKREntity,
  TodoRelProjectEntity,
  TodoStatus,
} from './type';
import { calcNextId } from './utils';

/**
 * O
 */
export const addO = ({
  entity: { content, userId },
  relativeUserIds,
}: AddOPayload): OEntity => {
  // calc new id
  const id = calcNextId(oTable);

  // update oTable
  const newEntity: OEntity = {
    id,
    content,
    userId,
  };
  oTable.push(newEntity);

  // update oRelTable
  const relUserIdSet = new Set(relativeUserIds);
  const newRels: ORelEntity[] = oTable
    .filter((o) => relUserIdSet.has(o.userId))
    .map((o) => ({
      OId: id,
      upperOId: o.id,
    }));
  oRelTable.push(...newRels);

  return newEntity;
};

export const editO = ({
  entity: { id: targetId, content },
  relativeUserIds,
}: EditOPayload): {
  entity: OEntity;
  rels?: ORelEntity[];
} => {
  const index = oTable.findIndex((o) => o.id === targetId);
  if (index < 0) {
    console.error(`[okrDB.crud] editO: o.id = ${targetId} not found`);
    return { entity: null };
  } else {
    // update oTable
    const originEntity = oTable[index];
    const newEntity = { ...originEntity, content };
    oTable.splice(index, 1, newEntity); // update content

    // update oRelTable

    // remove old
    const newUserIdSet = new Set(relativeUserIds);
    const restoreUserIdSet = new Set();
    const oRelUserMapper = getORelUserMapper();
    const oldRels = oRelTable
      .filter((rel) => rel.OId === targetId)
      .filter((rel) => {
        const userId = oRelUserMapper[rel.upperOId];
        const restore = newUserIdSet.has(userId);
        if (restore) {
          restoreUserIdSet.add(userId);
        }
        return !restore;
      });
    oldRels.forEach((rel) => {
      oRelTable.splice(oRelTable.indexOf(rel), 1);
    });

    // add new
    const newORels = oTable
      .filter(
        ({ userId }) =>
          newUserIdSet.has(userId) && !restoreUserIdSet.has(userId),
      )
      .map((o): ORelEntity => ({ OId: targetId, upperOId: o.id }));
    oRelTable.push(...newORels);

    return { entity: newEntity, rels: newORels };
  }
};

/**
 * KR
 */
export const addKR = ({ content, upperOId }: AddKRPayload): KREntity => {
  const id = calcNextId(krTable);

  const newEntity: KREntity = {
    id,
    content,
    upperOId,
  };
  krTable.push(newEntity);

  return newEntity;
};

export const editKR = ({
  id,
  content,
}: EditKRPayload): {
  entity: KREntity;
} => {
  const index = krTable.findIndex((kr) => kr.id === id);
  if (index < 0) {
    console.error(`[okrDB.crud] editKR: kr.id = ${id} not found`);
    return { entity: null };
  } else {
    const originKR = krTable[index];
    const newKR = { ...originKR, content };
    krTable.splice(index, 1, newKR);
    return { entity: newKR };
  }
};

/**
 * Project
 */
export const addProject = ({
  entity: { name, type },
  upperKRId,
  relativeUserIds,
}: AddProjectPayload): ProjectEntity => {
  const id = calcNextId(projectTable);

  const newEntity: ProjectEntity = {
    id,
    name,
    type,
  };
  projectTable.push(newEntity);

  const newRelKR: ProjectRelKREntity = {
    projectId: id,
    KRId: upperKRId,
  };
  projectRelKRTable.push(newRelKR);

  const newRelUsers: ProjectRelUserEntity[] = relativeUserIds.map((userId) => ({
    projectId: id,
    userId,
    duty: ProjectDuty.Unkonwn,
  }));
  projectRelUserTable.push(...newRelUsers);

  return newEntity;
};

export const editProject = ({
  entity: { id, name },
  relativeUserIds,
}: EditProjectPayload): {
  entity: ProjectEntity;
  rels?: ProjectRelUserEntity[];
} => {
  const index = projectTable.findIndex((p) => p.id === id);
  if (index < 0) {
    console.error(`[okrDB.crud] editProject: p.id = ${id} not found`);
    return { entity: null };
  } else {
    const originProject = projectTable[index];
    const newProject = { ...originProject, name };
    projectTable.splice(index, 1, newProject);

    const oldRelUsers = projectRelUserTable.filter(
      (rel) => rel.projectId === id,
    );
    oldRelUsers.forEach((rel) => {
      projectRelUserTable.splice(projectRelUserTable.indexOf(rel), 1);
    });

    const newRelUsers = relativeUserIds.map(
      (userId): ProjectRelUserEntity => ({
        projectId: id,
        userId,
        duty: ProjectDuty.Unkonwn,
      }),
    );
    projectRelUserTable.push(...newRelUsers);

    return { entity: newProject, rels: newRelUsers };
  }
};

/**
 * \Todo
 */
export const addTodo = ({
  entity: { name, userId },
  upperProjectId,
}: AddTodoPayload): TodoEntity => {
  const id = calcNextId(todoTable);

  const newEntity: TodoEntity = {
    id,
    ddl: '',
    status: TodoStatus.Incomplete,
    userId,
    name,
  };

  const newRelProject: TodoRelProjectEntity = {
    todoId: id,
    projectId: upperProjectId,
  };

  todoTable.push(newEntity);
  todoRelProjectTable.push(newRelProject);

  return newEntity;
};

export const editTodo = ({
  id,
  userId,
  name,
}: EditTodoPayload): {
  entity: TodoEntity;
} => {
  const index = todoTable.findIndex((t) => t.id === id);
  if (index < 0) {
    console.error(`[okrDB.crud] editTodo: t.id = ${id} not found`);
    return { entity: null };
  } else {
    const originTodo = todoTable[index];
    const newTodo = { ...originTodo, userId, name };
    todoTable.splice(index, 1, newTodo);
    return { entity: newTodo };
  }
};

export const deleteTodo = (todoId: number) => {
  let index = todoTable.findIndex((t) => t.id === todoId);
  // delete todoTable
  if (index >= 0) {
    todoTable.splice(index, 1);
  } else {
    console.error(`[deleteTodo] todoId: ${todoId} not found`);
  }

  // delete todoRelProjectTable
  const removedRels = todoRelProjectTable.filter((t) => t.todoId === todoId);
  removedRels.forEach((rel) => {
    todoRelProjectTable.splice(todoRelProjectTable.indexOf(rel), 1);
  });
};
