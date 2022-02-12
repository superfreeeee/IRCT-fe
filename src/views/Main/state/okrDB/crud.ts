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
} from './type';

/**
 * O
 */
export const addO = (o: AddOPayload) => {
  const { relOs, ...oEntity } = o;

  oTable.push(oEntity);
  oRelTable.push(...relOs);
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
export const addKR = (kr: KREntity) => {
  krTable.push(kr);
};

export const editKR = ({ id, content }: KREntity) => {
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
export const addProject = (p: AddProjectPayload) => {
  const { relKRs, relUsers, ...pEntity } = p;

  projectTable.push(pEntity);
  projectRelKRTable.push(...relKRs);
  projectRelUserTable.push(...relUsers);
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
export const addTodo = (t: AddTodoPayload) => {
  const { relProjects, ...tEntity } = t;

  todoTable.push(tEntity);
  todoRelProjectTable.push(...relProjects);
  // console.log(`[tmp] todoTable`, [...todoTable]);
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
