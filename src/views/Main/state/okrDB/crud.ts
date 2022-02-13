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
}: AddOPayload) => {
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
}: EditOPayload) => {
  const index = oTable.findIndex((o) => o.id === targetId);
  if (index < 0) {
    console.error(`[okrDB.crud] editO: o.id = ${targetId} not found`);
  } else {
    // update oTable
    const originEntity = oTable[index];
    oTable.splice(index, 1, { ...originEntity, content }); // update content

    // update oRelTable
    const relativeUserIdSet = new Set(relativeUserIds);
    const newORels = oTable
      .filter((o) => relativeUserIdSet.has(o.userId))
      .map((o): ORelEntity => ({ OId: targetId, upperOId: o.id }));

    const oldORels = oRelTable.filter((rel) => rel.OId === targetId);
    oldORels.forEach((rel) => {
      oRelTable.splice(oRelTable.indexOf(rel), 1);
    });
    oRelTable.push(...newORels);
  }
};

/**
 * KR
 */
export const addKR = ({ content, upperOId }: AddKRPayload) => {
  const id = calcNextId(krTable);

  const newEntity: KREntity = {
    id,
    content,
    upperOId,
  };
  krTable.push(newEntity);

  return newEntity;
};

export const editKR = ({ id, content }: EditKRPayload) => {
  const index = krTable.findIndex((kr) => kr.id === id);
  if (index < 0) {
    console.error(`[okrDB.crud] editKR: kr.id = ${id} not found`);
  } else {
    const originKR = krTable[index];
    krTable.splice(index, 1, { ...originKR, content });
  }
};

/**
 * Project
 */
export const addProject = ({
  entity: { name, type },
  upperKRId,
  relativeUserIds,
}: AddProjectPayload) => {
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
};

export const editProject = ({
  entity: { id, name },
  relativeUserIds,
}: EditProjectPayload) => {
  const index = projectTable.findIndex((p) => p.id === id);
  if (index < 0) {
    console.error(`[okrDB.crud] editProject: p.id = ${id} not found`);
  } else {
    const originProject = projectTable[index];
    projectTable.splice(index, 1, { ...originProject, name });

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
  }
};

/**
 * \Todo
 */
export const addTodo = ({
  entity: { name, userId },
  upperProjectId,
}: AddTodoPayload) => {
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

  console.log(`[tmp] newEntity`, newEntity);
  console.log(`[tmp] newRelProject`, newRelProject);
};

export const editTodo = ({ id, userId, name }: EditTodoPayload) => {
  const index = todoTable.findIndex((t) => t.id === id);
  if (index < 0) {
    console.error(`[okrDB.crud] editTodo: t.id = ${id} not found`);
  } else {
    const originTodo = todoTable[index];
    todoTable.splice(index, 1, { ...originTodo, userId, name });
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

  console.log(`new todoRelProjectTable`, [...todoRelProjectTable]);
  // delete todoRelProjectTable
  const removedRels = todoRelProjectTable.filter((t) => t.todoId === todoId);
  removedRels.forEach((rel) => {
    todoRelProjectTable.splice(todoRelProjectTable.indexOf(rel), 1);
  });
  console.log(`new todoRelProjectTable`, [...todoRelProjectTable]);
};
