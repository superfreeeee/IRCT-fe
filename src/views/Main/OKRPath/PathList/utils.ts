import {
  EntityNode,
  EntityType,
  ViewPointEntity,
} from '@/views/Main/state/okrDB/type';
import { deepCopy } from '@/utils';
import { PathNode } from '../PathBoard/type';
import {
  getEntityNode,
  getRelativeUserSource,
} from '@/views/Main/state/okrDB/api';

/**
 * EditEntityModalActionType.Delete + Todo
 *   may delete multiple todos
 */
export const update_deleteTodoNode = (
  oldTree: EntityNode,
  targetId: number,
): EntityNode => {
  const newTree = deepCopy(oldTree);

  const _deleteTodoNode = (node: EntityNode) => {
    if (node.node.type === EntityType.Project) {
      // Entity.Todo appears under Entity.Project Node
      const removedIdSet = new Set<string>();
      for (const [id, child] of Object.entries(node.children)) {
        const {
          node: { type, originId },
        } = child;

        if (type === EntityType.Todo) {
          if (originId === targetId) {
            removedIdSet.add(id);
          }
        } else {
          console.warn(
            `[update_deleteTodoNode] Non-Todo node appear in Project.children`,
            node,
          );
        }
      }

      removedIdSet.forEach((id) => {
        delete node.children[id]; // remove from node
      });
    } else {
      // Non Project Node => map children
      Object.values(node.children).forEach((child) => _deleteTodoNode(child));
    }
  };

  _deleteTodoNode(newTree);

  return newTree;
};

const addNewNodeTypeMapper: { [sourceType in EntityType]: EntityType } = {
  [EntityType.User]: EntityType.O,
  [EntityType.O]: EntityType.KR,
  [EntityType.KR]: EntityType.Project,
  [EntityType.Project]: EntityType.Todo,
  [EntityType.Todo]: null,
};

/**
 * EditEntityModalActionType.Create
 */
export const update_addNewNode = (
  oldTree: EntityNode,
  { data: { type: sourceType, id: sourceId } }: PathNode,
  entity: ViewPointEntity,
): EntityNode => {
  const newTree = deepCopy(oldTree);
  const targetType = addNewNodeTypeMapper[sourceType];

  if (!targetType) {
    console.error(
      `[update_addNewNode] create new node from todo ${sourceType} type`,
    );
    return oldTree;
  }

  if (entity.type !== targetType) {
    console.error(
      `[update_addNewNode] new node with wrong type: expect = ${targetType}, got ${entity.type}`,
      entity,
    );
    return oldTree;
  }

  const targetNode = getEntityNode(entity);

  // insert targetNode into newTree
  if (!_insertEntityNode(newTree, sourceId, targetNode)) {
    console.error(`[update_addNewNode] insert fail`, newTree, targetNode);
    return oldTree;
  }

  return newTree;
};

const _insertEntityNode = (
  root: EntityNode,
  sourceId: string,
  target: EntityNode,
): boolean => {
  if (root.node.id === sourceId) {
    root.children[target.node.id] = target;
    return true;
  }

  return Object.values(root.children)
    .map((child) => _insertEntityNode(child, sourceId, target))
    .reduce((res, success) => res || success, false);
};

/**
 * EditEntityModalActionType.Edit
 */
export const update_editNode = (
  oldTree: EntityNode,
  sourceNode: PathNode,
  { type, id, originId, content }: ViewPointEntity,
): EntityNode => {
  const newTree = deepCopy(oldTree);

  if (sourceNode.id !== id) {
    console.error(
      `[update_editNode] ambiguous id appears: node.id = ${sourceNode.id}, entity.id = ${id}`,
    );
    return oldTree;
  }

  const targetNode = _getTargetNode(newTree, id);
  if (!targetNode) {
    console.error(`[update_editNode] targetNode ${id} not found`, sourceNode);
    return oldTree;
  }

  // update content
  targetNode.node.content = content;
  // update relativeUsers
  if (type === EntityType.O || type === EntityType.Project) {
    const { entities } = getRelativeUserSource(originId as number, id, type);
    targetNode.relativeUsers = entities;
  }
  return newTree;
};

const _getTargetNode = (root: EntityNode, targetId: string): EntityNode => {
  if (root.node.id === targetId) {
    return root;
  }

  for (const child of Object.values(root.children)) {
    const targetNode = _getTargetNode(child, targetId);
    if (targetNode != null) {
      return targetNode;
    }
  }

  return null;
};
