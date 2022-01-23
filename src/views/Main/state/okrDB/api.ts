import { EntityType, OEntity, OrganizationViewPoint, OrganizationViewPointEntity, OrganizationViewPointRelation, UserEntity } from "./type";

import { oRelTable, oTable, userRelTable, userTable } from "./db";

// ========== public ==========
export const getOrganizationViewPoint = (): OrganizationViewPoint => {
  const CEO_ID = "user-666"; // ! hard code set CEO_ID

  const entities: OrganizationViewPointEntity[] = [];
  const relations: OrganizationViewPointRelation[] = [];

  const userEntityMapper = createUserEntityMapper();

  const fromIdQueue = [CEO_ID]; // start with CEO
  const userAppeared = new Set<string>();
  while (fromIdQueue.length > 0) {
    const fromId = fromIdQueue.shift();
    if (userAppeared.has(fromId)) {
      continue;
    }
    userAppeared.add(fromId);

    // push user
    entities.push({ type: EntityType.User, ...userEntityMapper[fromId] });

    // push user O list
    const oList = getOsByUserId(fromId);
    oList.forEach((o) => {
      const { id, content } = o;
      const oId = `o-${id}`;
      entities.push({
        type: EntityType.O,
        id: oId,
        content,
      });

      relations.push({
        fromId: fromId,
        toId: oId,
      });
    });

    // get relations
    const userIds = getUserIdsByBossId(fromId);
    userIds.forEach((userId) => {
      // push relation
      relations.push({
        fromId: fromId,
        toId: userId,
      });

      // add user to search list
      fromIdQueue.push(userId);
    });
  }

  // oRelTable.filter((oRel) => oRel.OId === CEO_ID);

  return {
    entities,
    relations,
  };
};

// ========== private ==========
const getUserIdsByBossId = (bossId: string): string[] => {
  return userRelTable.filter((r) => r.bossId === bossId).map((r) => r.userId);
};

const getOsByUserId = (userId: string): OEntity[] => {
  return oTable.filter((o) => o.userId === userId);
};

type UserEntityMapper = { [userId: string]: OrganizationViewPointEntity };
const createUserEntityMapper = (): UserEntityMapper => {
  return userTable.reduce((mapper, nextUser): UserEntityMapper => {
    const { id, avatar, name } = nextUser;
    mapper[nextUser.id] = {
      type: EntityType.User,
      id,
      avatar,
      name,
    };
    return mapper;
  }, {} as UserEntityMapper);
};
