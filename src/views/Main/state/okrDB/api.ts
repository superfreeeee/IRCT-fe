import {
  EntityNode,
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
import { createEntityNode } from "./utils";

// ========== public ==========
/**
 * 组织视图数据
 */
export const getOrganizationViewPoint = (): ViewPointSource => {
  const entities: OrganizationViewPointEntity[] = [];
  const relations: OrganizationViewPointRelation[] = [];

  const userEntityMapper = createUserEntityMapper();
  const oIdSet = new Set<number>(); // collect all appeared O'id
  const oIdMap = new Map<number, string>(); // O'id => Node.id

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

    let _oSeqForUser = 1;
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
        seq: _oSeqForUser,
        content,
      });
      _oSeqForUser++;

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

  /**
   * O-O relation
   *   force = 0
   */
  oRelTable
    .filter((oRel) => oIdSet.has(oRel.OId) && oIdSet.has(oRel.upperOId))
    .forEach((oRel) => {
      relations.push({
        source: oIdMap.get(oRel.OId),
        target: oIdMap.get(oRel.upperOId),
        additional: true,
        force: 0,
      });
    });

  return {
    type: ViewPointType.Organization,
    entities,
    relations,
  };
};

/**
 * 个人视图数据
 */
export const getPersonalViewPoint = (centerUserId: string): ViewPointSource => {
  const entities: PersonalViewPointEntity[] = [];
  const relations: PersonalViewPointRelation[] = [];

  // ========== handle center user ==========
  // add center User
  const { avatar, name } = getUserEntityByUserId(centerUserId);
  const userEntity: PersonalViewPointEntity = {
    type: EntityType.User,
    id: centerUserId,
    originId: centerUserId,
    avatar,
    name,
  };
  entities.push(userEntity);
  // create center entity node
  const inheritTree = createEntityNode(userEntity);

  // ========== handle O ==========
  const oEntityNodeMap = new Map<string, EntityNode>();
  const oList = getOsByUserId(centerUserId)
    .map((o) => {
      const oId = wrapId(EntityType.O, o.id);
      return {
        ...o,
        id: oId,
        originId: o.id,
      };
    })
    .map((o, i) => {
      const { id: oId, originId } = o;

      // add O entity
      const oEntity: PersonalViewPointEntity = {
        type: EntityType.O,
        id: oId,
        originId,
        seq: i + 1,
        content: o.content,
      };
      entities.push(oEntity);

      // add user-O relation
      const userORelation: PersonalViewPointRelation = {
        source: centerUserId,
        target: oId,
      };
      relations.push(userORelation);

      // add o entity nodes
      const entityNode = createEntityNode(oEntity, userORelation);
      inheritTree.children[oId] = entityNode;

      oEntityNodeMap.set(oId, entityNode);

      return o;
    });

  // ========== handle KR ==========
  const krEntityNodeMap = new Map<string, EntityNode>();
  const krList = oList
    .map(({ id, originId }) => ({
      oId: id,
      krList: getKRsByOId(originId).map((kr) => {
        // transform id
        const krId = wrapId(EntityType.KR, kr.id);
        return {
          ...kr,
          id: krId,
          originId: kr.id,
        };
      }),
    }))
    .map(({ oId: source, krList }) => {
      const oEntityNode = oEntityNodeMap.get(source);

      krList.forEach((kr, i) => {
        // add KR entity
        const krEntity: PersonalViewPointEntity = {
          type: EntityType.KR,
          id: kr.id,
          originId: kr.originId,
          seq: i + 1,
          content: kr.content,
        };
        entities.push(krEntity);

        // add O-KR relation
        const oKRRelation: PersonalViewPointRelation = {
          source,
          target: kr.id,
        };
        relations.push(oKRRelation);

        // add kr entity node
        const krEntityNode = createEntityNode(krEntity, oKRRelation);
        oEntityNode.children[kr.id] = krEntityNode;

        krEntityNodeMap.set(kr.id, krEntityNode);
      });

      return krList;
    })
    .flat();

  // ========== handle Project ==========
  // project could appear multiple times
  const _projectCount = new Map<number, number>(); // id => count
  const projectEntityNodeMap = new Map<string, EntityNode>(); // id(string) => EntityNode
  const projectList = krList
    .map(({ id, originId }) => ({
      krId: id,
      projectList: getProjectsByKRId(originId).map((p) => {
        // transform id, calc seq
        const pId = p.id;
        const count = (_projectCount.get(pId) || 0) + 1;
        _projectCount.set(pId, count);

        const projectId = wrapId(EntityType.Project, pId, count);

        return {
          ...p,
          id: projectId,
          originId: pId,
        };
      }),
    }))
    .map(({ krId: source, projectList }) => {
      const krEntityNode = krEntityNodeMap.get(source);

      projectList.forEach((p, i) => {
        const { id, originId } = p;

        // add Project entity
        const pEntity: PersonalViewPointEntity = {
          type: EntityType.Project,
          id,
          originId,
          seq: i + 1,
          content: p.name,
        };
        entities.push(pEntity);

        // add KR-Project relation
        const krProjectRelation: PersonalViewPointRelation = {
          source,
          target: id,
        };
        relations.push(krProjectRelation);

        // add project entity node
        const pEntityNode = createEntityNode(pEntity, krProjectRelation);
        krEntityNode.children[id] = pEntityNode;

        projectEntityNodeMap.set(id, pEntityNode);
      });

      return projectList;
    })
    .flat();

  // ========== handle Todo ==========
  const _todoCount = new Map();
  const todoList = projectList
    .map(({ id, originId }) => ({
      id,
      todoList: getTodosByProjectId(originId).map((t) => {
        // transform id, calc seq
        const tId = t.id;
        const count = (_todoCount.get(tId) || 0) + 1;
        _todoCount.set(t.id, count);

        const todoId = wrapId(EntityType.Todo, tId, count);

        return {
          ...t,
          id: todoId,
          originId: tId,
        };
      }),
    }))
    .map(({ id: source, todoList }) => {
      const pEntityNode = projectEntityNodeMap.get(source);

      todoList.forEach((t, i) => {
        const { id, originId } = t;

        // add Todo entity
        const todoEntity: PersonalViewPointEntity = {
          type: EntityType.Todo,
          id,
          originId,
          seq: i + 1,
          content: t.name,
        };
        entities.push(todoEntity);

        // add Project-Todo relation
        const pTodoRelation: PersonalViewPointRelation = {
          source,
          target: id,
        };
        relations.push(pTodoRelation);

        // add todo entity node
        const todoEntityNode = createEntityNode(todoEntity, pTodoRelation);
        pEntityNode.children[id] = todoEntityNode;
      });

      return todoList;
    })
    .flat();

  // TODO clear console
  // console.group(`[getPersonalViewPoint] internal`);
  // console.log(`oList`, oList);
  // console.log(`krList`, krList);
  // console.log(`projectList`, projectList);
  // console.log(`todoList`, todoList);

  // console.log(`entities`, entities);
  // console.log(`relations`, relations);
  // console.log(`inheritTree`, inheritTree);
  // console.groupEnd();

  return {
    type: ViewPointType.Personal,
    entities,
    relations,
    inheritTree,
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
