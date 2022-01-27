import {
  EntityType,
  KREntity,
  MergedEntity,
  OEntity,
  OrganizationViewPointEntity,
  OrganizationViewPointRelation,
  PersonalViewPointEntity,
  PersonalViewPointRelation,
  UserEntity,
  ViewPointSource,
  ViewPointType,
} from "./type";

import { CEO_ID, krTable, oRelTable, oTable, projectRelKRTable, projectTable, todoRelProjectTable, todoTable, userRelTable, userTable } from "./db";

// ========== public ==========
export const getOrganizationViewPoint = (): ViewPointSource => {
  const entities: OrganizationViewPointEntity[] = [];
  const relations: OrganizationViewPointRelation[] = [];

  const userEntityMapper = createUserEntityMapper();
  const oIdSet = new Set(); // collect all appeared O'id
  const oIdMap = new Map();

  const fromIdQueue = [CEO_ID]; // start with CEO
  const userAppeared = new Set<string>();
  while (fromIdQueue.length > 0) {
    const fromId = fromIdQueue.shift();
    if (userAppeared.has(fromId)) {
      continue;
    }
    userAppeared.add(fromId);

    // append User entity
    entities.push({ type: EntityType.User, ...userEntityMapper[fromId] });

    const oList = getOsByUserId(fromId);
    oList.forEach((o) => {
      const { id, content } = o;
      const oId = wrapId(EntityType.O, id);

      oIdSet.add(id);
      oIdMap.set(id, oId);
      // append O entity
      entities.push({
        type: EntityType.O,
        id: oId,
        originId: id,
        content,
      });

      // append User-O relation
      relations.push({
        source: fromId,
        target: oId,
      });
    });

    const userIds = getUserIdsByBossId(fromId);
    userIds.forEach((userId) => {
      // append User-User relation
      relations.push({
        source: fromId,
        target: userId,
      });

      // add user to search more O
      fromIdQueue.push(userId);
    });
  }

  oRelTable
    .filter((oRel) => oIdSet.has(oRel.OId) && oIdSet.has(oRel.upperOId))
    .forEach((oRel) => {
      relations.push({
        source: oIdMap.get(oRel.OId),
        target: oIdMap.get(oRel.upperOId),
        additional: true,
      });
    });

  return {
    type: ViewPointType.Organization,
    entities,
    relations,
  };
};

export const getPersonalViewPoint = (centerUserId: string): ViewPointSource => {
  const entities: PersonalViewPointEntity[] = [];
  const relations: PersonalViewPointRelation[] = [];

  // add center User
  const { avatar } = getUserEntityByUserId(centerUserId);
  entities.push({
    type: EntityType.User,
    id: centerUserId,
    originId: centerUserId,
    avatar,
  });

  const oList = getOsByUserId(centerUserId);
  oList.forEach((o) => {
    const OId = wrapId(EntityType.O, o.id);

    // add O entity
    entities.push({
      type: EntityType.O,
      id: OId,
      originId: o.id,
    });

    // add user-O relation
    relations.push({
      source: centerUserId,
      target: OId,
    });
  });

  const krList = oList
    .map(({ id }) => ({
      oId: id,
      krList: getKRsByOId(id),
    }))
    .map(({ oId: OId, krList }) => {
      const source = wrapId(EntityType.O, OId);

      // add O-KR relation
      krList.forEach((kr) => {
        const krId = wrapId(EntityType.KR, kr.id);
        relations.push({
          source,
          target: krId,
        });
      });

      return krList;
    })
    .flat();
  krList.forEach((kr) => {
    // add KR entity
    const krId = wrapId(EntityType.KR, kr.id);
    entities.push({
      type: EntityType.KR,
      id: krId,
      originId: kr.id,
    });
  });

  // project could appear multiple times
  const _projectCount = new Map();
  const _projectIdMap = new Map();
  const projectList = krList
    .map(({ id }) => ({
      krId: id,
      projectList: getProjectsByKRId(id),
    }))
    .map(({ krId, projectList }) => {
      const source = wrapId(EntityType.KR, krId);

      // add KR-Project relation
      projectList.forEach((p) => {
        const seq = (_projectCount.get(p.id) || 0) + 1;
        _projectCount.set(p.id, seq);

        const projectId = wrapId(EntityType.Project, p.id, seq);
        _projectIdMap.set(p, projectId);

        relations.push({
          source,
          target: projectId,
        });
      });

      return projectList;
    })
    .flat();
  projectList.forEach((p) => {
    // add Project entity
    const projectId = _projectIdMap.get(p);
    entities.push({
      type: EntityType.Project,
      id: projectId,
      originId: p.id,
    });
  });

  const _todoCount = new Map();
  const _todoIdMap = new Map();
  const todoList = projectList
    .map((project) => ({
      project,
      todoList: getTodosByProjectId(project.id),
    }))
    .map(({ project, todoList }) => {
      const source = _projectIdMap.get(project);

      // add Project-Todo relation
      todoList.forEach((t) => {
        const seq = (_todoCount.get(t.id) || 0) + 1;
        _todoCount.set(t.id, seq);

        const todoId = wrapId(EntityType.Todo, t.id, seq);
        _todoIdMap.set(t, todoId);

        relations.push({
          source,
          target: todoId,
        });
      });

      return todoList;
    })
    .flat();

  todoList.forEach((t) => {
    // add Todo entity
    const todoId = _todoIdMap.get(t);
    entities.push({
      type: EntityType.Todo,
      id: todoId,
      originId: t.id,
    });
  });

  // console.group(`[getPersonalViewPoint] internal`);
  // console.log(`oList`, oList);
  // console.log(`krList`, krList);
  // console.log(`projectList`, projectList);
  // console.log(`todoList`, todoList);

  // console.log(`entities`, entities);
  // console.log(`relations`, relations);
  // console.groupEnd();

  return {
    type: ViewPointType.Personal,
    entities,
    relations,
  };
};

// ========== id with entity type ==========
const wrapId = (type: EntityType, id: number, seq?: number) => {
  const wrappedId = `${type}-${id}`.toLowerCase();
  return seq === undefined ? wrappedId : `${wrappedId}_${seq}`;
};
// ========== private ==========
/**
 * User 相关
 * 获取所有下属 id
 */
const getUserIdsByBossId = (bossId: string): string[] => {
  return userRelTable.filter((r) => r.bossId === bossId).map((r) => r.userId);
};

/**
 * User 相关
 * 创建 userId => Entity
 */
type UserEntityMapper = { [userId: string]: OrganizationViewPointEntity };
const createUserEntityMapper = (): UserEntityMapper => {
  return userTable.reduce((mapper, nextUser): UserEntityMapper => {
    const { id, avatar, name } = nextUser;
    mapper[nextUser.id] = {
      type: EntityType.User,
      id,
      originId: id,
      avatar,
      name,
    };
    return mapper;
  }, {} as UserEntityMapper);
};

/**
 * User 相关
 * 获取目标用户
 */
const getUserEntityByUserId = (userId: string): UserEntity => {
  return userTable.filter((user) => user.id === userId)[0];
};

/**
 * O 相关
 * 找出指定 User 关联的 Os
 */
const getOsByUserId = (userId: string): OEntity[] => {
  return oTable.filter((o) => o.userId === userId);
};

/**
 * KR 相关
 * 找出指定 O 关联的 KRs
 */
const getKRsByOId = (OId: number): KREntity[] => {
  return krTable.filter((kr) => kr.upperOId === OId);
};

/**
 * Project 相关
 * 找出指定 KR 关联的 Projects
 */
const getProjectsByKRId = (KRId: number) => {
  const projectWithRelKRTable = joinTables(projectTable, projectRelKRTable, [{ col1: "id", col2: "projectId" }]);
  return projectWithRelKRTable.filter((p) => p.KRId === KRId);
};

/**
 * \Todo 相关
 * 找出指定 Project 关联的 Todos
 */
const getTodosByProjectId = (projectId: number) => {
  const todoWithRelProjectTable = joinTables(todoTable, todoRelProjectTable, [{ col1: "id", col2: "todoId" }]);
  return todoWithRelProjectTable.filter((t) => t.projectId === projectId);
};

interface JoinTablesColumnMap {
  col1: string;
  col2: string;
}
const joinTables = <E1, E2>(t1: E1[], t2: E2[], mapList: JoinTablesColumnMap | JoinTablesColumnMap[] = []): MergedEntity<E1, E2>[] => {
  // ensure mapList to be a list
  if (!Array.isArray(mapList)) {
    mapList = [mapList];
  }

  const entities: MergedEntity<E1, E2>[] = [];

  // 做笛卡尔积
  for (const o1 of t1) {
    for (const o2 of t2) {
      let match = true;
      // check if all col match
      for (const { col1, col2 } of mapList) {
        if (o1[col1] !== o2[col2]) {
          match = false;
          break;
        }
      }
      if (match) {
        entities.push({
          ...o1,
          ...o2,
        });
      }
    }
  }

  return entities;
};
