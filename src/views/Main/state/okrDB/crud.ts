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
  KREntity,
  OEntityDetail,
  ProjectEntityDetail,
  TodoEntityDetail,
} from './type';

export const addO = (o: OEntityDetail) => {
  const { relOs, ...oEntity } = o;

  oTable.push(oEntity);
  oRelTable.push(...relOs);
};

export const addKR = (kr: KREntity) => {
  krTable.push(kr);
};

export const addProject = (p: ProjectEntityDetail) => {
  const { relKRs, relUsers, ...pEntity } = p;

  projectTable.push(pEntity);
  projectRelKRTable.push(...relKRs);
  projectRelUserTable.push(...relUsers);
};

export const addTodo = (t: TodoEntityDetail) => {
  const { relProjects, ...tEntity } = t;

  todoTable.push(tEntity);
  todoRelProjectTable.push(...relProjects);
};

export const deleteTodo = (todoId: number) => {
  let index = todoTable.findIndex((t) => t.id === todoId);
  if (index >= 0) {
    todoTable.splice(index, 1);
  } else {
    console.error(`[deleteTodo] todoId: ${todoId} not found`);
  }

  while (true) {
    index = todoRelProjectTable.findIndex((t) => t.todoId === todoId);
    if (index < 0) {
      break;
    }
    todoRelProjectTable.splice(index, 1);
  }
};
