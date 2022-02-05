import { EntityNode, EntityNodeMap, EntityType, ViewPointEntity, ViewPointRelation } from "./type";

export const createEntityNode = (node: ViewPointEntity = null, relation: ViewPointRelation = null, children: EntityNodeMap = {}): EntityNode => {
  return {
    node,
    relation,
    children,
    expand: node.type === EntityType.O, // default expand for O Entity
    isTarget: false,
  };
};
