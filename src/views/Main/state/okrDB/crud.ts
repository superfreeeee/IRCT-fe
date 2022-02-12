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
  KREntity,
  OEntityDetail,
  ORelEntity,
  ProjectEntityDetail,
  TodoEntityDetail,
} from './type';

/**
 * O
 */
export const addO = (o: OEntityDetail) => {
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
    console.error(`[okrDB.curd] editO: o.id = ${targetId} not found`);
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

/**
 * Project
 */
export const addProject = (p: ProjectEntityDetail) => {
  const { relKRs, relUsers, ...pEntity } = p;

  projectTable.push(pEntity);
  projectRelKRTable.push(...relKRs);
  projectRelUserTable.push(...relUsers);
};

/**
 * \Todo
 */
export const addTodo = (t: TodoEntityDetail) => {
  const { relProjects, ...tEntity } = t;

  todoTable.push(tEntity);
  todoRelProjectTable.push(...relProjects);
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
