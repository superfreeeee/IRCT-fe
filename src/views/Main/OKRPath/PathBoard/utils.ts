import { EntityType } from '@views/Main/state/okrDB/type';
import { PathNode } from './type';

enum NodeSize {
  CenterUser = 39,
}

const CENTER_USER_RADIUS = 39;
const SIDE_USER_RADIUS = 29;
const O_RADIUS = 22;
const KR_RADIUS = 17;
const PROJECT_RADIUS = 12;
const TODO_RADIUS = 7;

/**
 * 填充节点颜色
 */
export const nodeRadius = (d: PathNode) => {
  if (d.data.type === EntityType.User) {
    const { id } = d.data;
    if (id === 'user-666') {
      return 39; // CEO Size
    } else {
      return 29; // other user
    }
  } else {
    return 17; // o
  }
};
