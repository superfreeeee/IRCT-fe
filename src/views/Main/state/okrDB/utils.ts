import {
  EntityNode,
  EntityNodeMap,
  EntityType,
  ViewPointEntity,
  ViewPointRelation,
} from './type';

export const createEntityNode = (
  node: ViewPointEntity = null, // 当前节点
  relation: ViewPointRelation = null, // 向上关系
  children: EntityNodeMap = {}, // 子节点
  relativeUsers: ViewPointEntity[] = [], // 对齐用户
): EntityNode => {
  return {
    node,
    relation,
    children,
    relativeUsers,
    expand: node.type === EntityType.O, // default expand for O Entity
    isTarget: false,
  };
};
