import * as d3 from 'd3';

import { EntityType, ViewPointType } from '@views/Main/state/okrDB/type';
import {
  NodeColor,
  NodeImagePadding,
  NodeRadius,
  PathLink,
  PathNode,
  RootSelection,
  TickBindRefs,
} from './type';

// ========== style ==========
/**
 * 节点半径
 */
interface CalcNodeRadius {
  (d: PathNode): number;
}
export const nodeRadius = (viewPointType: ViewPointType): CalcNodeRadius => {
  const calcAndStoreRadius = (calcRadius: CalcNodeRadius) => (d: PathNode) => {
    const radius = calcRadius(d);
    d.store.radius = radius;
    return radius;
  };

  if (viewPointType === ViewPointType.Organization) {
    // 1. 组织视图
    const calcRadius = (d: PathNode) => {
      const { type, id } = d.data;
      switch (type) {
        case EntityType.User:
          return id === 'user-666'
            ? NodeRadius.CenterUser
            : NodeRadius.SideUser;

        case EntityType.O:
        default:
          return NodeRadius.O;
      }
    };
    return calcAndStoreRadius(calcRadius);
  } else {
    // 2. 个人视图
    const map: { [type in EntityType]: NodeRadius } = {
      [EntityType.User]: NodeRadius.CenterUser,
      [EntityType.O]: NodeRadius.O,
      [EntityType.KR]: NodeRadius.KR,
      [EntityType.Project]: NodeRadius.Project,
      [EntityType.Todo]: NodeRadius.Todo,
    };
    const calcRadius = (d: PathNode) => map[d.data.type] || NodeRadius.Todo;

    return calcAndStoreRadius(calcRadius);
  }
};

interface CalcNodeImageWidth {
  (d: PathNode): number;
}
export const nodeImageWidth = (
  viewPointType: ViewPointType,
): CalcNodeImageWidth => {
  const calcWidth = (d: PathNode) => {
    const { type, id } = d.data;
    if (type !== EntityType.User) {
      // image only for user
      return 0;
    }

    let width: number, padding: NodeImagePadding;
    if (viewPointType === ViewPointType.Organization) {
      if (id === 'user-666') {
        padding = NodeImagePadding.L1;
        width = (NodeRadius.CenterUser - padding) * 2;
      } else {
        padding = NodeImagePadding.L2;
        width = (NodeRadius.SideUser - padding) * 2;
      }
    } else {
      padding = NodeImagePadding.L1;
      width = (NodeRadius.CenterUser - padding) * 2;
    }

    // save at store
    d.store.imageWidth = width;
    d.store.imagePadding = padding;

    return width;
  };

  return calcWidth;
};

/**
 * 节点填充颜色
 */
interface CalcNodeColor {
  (d: PathNode): string;
}
export const nodeColor: CalcNodeColor = (function () {
  const _nodeColorMap: { [type in EntityType]: NodeColor } = {
    [EntityType.User]: NodeColor.User,
    [EntityType.O]: NodeColor.O,
    [EntityType.KR]: NodeColor.KR,
    [EntityType.Project]: NodeColor.Project,
    [EntityType.Todo]: NodeColor.Todo,
  };

  return (d: PathNode) => {
    const color = _nodeColorMap[d.data.type];
    d.store.color = color;
    return color;
  };
})();

export const nodeText = (d: PathNode) => {
  const { type, id } = d.data;
  let text: string;
  if ([EntityType.O, EntityType.KR].includes(type)) {
    text = `${type}${id.split('-')[1]}`;
  } else {
    text = '';
  }

  d.store.text = text;

  return text;
};

// ========== simulation action ==========
/**
 * 模拟相关操作
 */

/**
 * 模拟中
 */
export const onTick =
  ({ linksRef, nodesRef }: TickBindRefs) =>
  () => {
    linksRef.current
      .each((d) => {
        const { x: x1, y: y1 } = d.source as PathNode;
        const { x: x2, y: y2 } = d.target as PathNode;

        const len = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
        const scale = len / 2;

        let degree = (Math.asin((y2 - y1) / len) / Math.PI) * 180;

        if (x2 < x1) {
          degree = (180 - degree * Math.sign(degree)) * Math.sign(degree);
        }

        const angle = degree;

        d.store = {
          ...d.store,
          x1,
          y1,
          angle,
          scale,
        };
      })
      .attr('transform', (d) => {
        const { x1, y1, angle, scale } = d.store;
        return `translate(${x1},${y1}) rotate(${angle}) scale(${scale},1)`;
      });

    nodesRef.current
      .select('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);

    nodesRef.current
      .select('image,text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y);
  };

/**
 * 模拟结束
 */
export const onEnd = (simulation: d3.Simulation<PathNode, any>) => () => {
  console.log(`[onEnd] simulation end: alpha = ${simulation.alpha()}`);
};

// ========== node drag ==========
/**
 * 节点拖拽
 */
export const onDrag = (simulation: d3.Simulation<PathNode, any>) => {
  let dragging = false;

  const dragStart = (e, d: PathNode) => {
    if (!d.draggable) {
      return;
    }
    const { x, y } = d;
    // store origin x,y
    d.fx = x;
    d.fy = y;
  };

  const dragDrag = (e, d: PathNode) => {
    if (!d.draggable) {
      return;
    }
    if (!dragging) {
      dragging = true;
      /**
       * change alpha target when first move,
       *   not active just for only click
       */
      // simulation state
      simulation.alphaTarget(0.1).restart();
    }
    const { x, y } = e;
    // poisition set to fix
    d.fx = x;
    d.fy = y;
  };

  const dragEnd = (e, d: PathNode) => {
    if (!d.draggable) {
      return;
    }
    const { fx, fy } = d;
    // reset x,y
    d.x = fx;
    d.y = fy;
    d.fx = null;
    d.fy = null;
    // simulation state
    if (dragging) {
      simulation.alphaTarget(0).alpha(0.5).restart();
      dragging = false;
    }
  };

  return d3
    .drag<any, PathNode>()
    .on('start', dragStart)
    .on('drag', dragDrag)
    .on('end', dragEnd);
};

// ========== mask action ==========
/**
 * 根节点平移、缩放
 */
export const onTransZoom = (root: RootSelection) => {
  return d3.zoom().on('zoom', (e) => {
    root.attr('transform', e.transform);
  });
};

/**
 * 点击平移遮罩（点击非节点位置）
 *   清除节点/边 active 状态
 */
export const onMaskClick =
  ({ linksRef, nodesRef }: TickBindRefs) =>
  (e: MouseEvent, d: PathNode) => {
    // clear all active
    linksRef.current
      .filter((link) => link.store.active)
      .each((d) => (d.store.active = false))
      .attr('fill', (d) => d.store.color);
  };

// ========== node hover/click ==========
/**
 * 节点 hover
 *   关联边着色
 */
const calcRelativeLinks = (
  targetNode: PathNode,
  links: PathLink[],
): Set<PathLink> => {
  const nodeId = targetNode.id;
  const activeLinks: Set<PathLink> = new Set();
  let parentId: string = null;

  // targetId => sourceId
  const relationMap = {};

  // 1. calc children
  links.forEach((link) => {
    const sourceId = (link.source as PathNode).id;
    const targetId = (link.target as PathNode).id;

    // check parent node
    if (targetId === nodeId) {
      if (parentId !== null) {
        console.log(`multiple source for one node: ${nodeId}`);
      }
      parentId = sourceId;
    }

    // append child
    if (sourceId === nodeId) {
      activeLinks.add(link);
    }

    relationMap[targetId] = sourceId;
  });

  // 2. calc ancestors
  const inheritIds: Set<string> = new Set([nodeId]);
  while (parentId !== null) {
    inheritIds.add(parentId);
    parentId = relationMap[parentId] || null; // null if not exists
  }

  links.forEach((link) => {
    if (
      inheritIds.has((link.source as PathNode).id) &&
      inheritIds.has((link.target as PathNode).id)
    ) {
      activeLinks.add(link);
    }
  });

  return activeLinks;
};
export const onEnterNode =
  ({ linksRef, nodesRef }: TickBindRefs) =>
  (e: MouseEvent, d: PathNode) => {
    const activeLinks = calcRelativeLinks(d, linksRef.current.data());
    // fill activeColor
    linksRef.current
      .filter((link) => activeLinks.has(link))
      .attr('fill', (d) => d.store.activeColor);
  };

export const onLeaveNode =
  ({ linksRef, nodesRef }: TickBindRefs) =>
  (e: MouseEvent, d: PathNode) => {
    const activeLinks = calcRelativeLinks(d, linksRef.current.data());
    // remove activeColor
    linksRef.current
      .filter((link) => activeLinks.has(link))
      .filter((link) => !link.store.active) // recover unactive link
      .attr('fill', (d) => d.store.color);
  };

/**
 * 节点 click
 *   节点着色
 *   link active 状态 = true
 */
export const onClickNode =
  ({ linksRef, nodesRef }: TickBindRefs) =>
  (e: MouseEvent, d: PathNode) => {
    const activeLinks = calcRelativeLinks(d, linksRef.current.data());
    // fill activeColor & state active = true
    const links = linksRef.current;
    // clear old active
    links
      .filter((link) => link.store.active)
      .each((d) => (d.store.active = false))
      .attr('fill', (d) => d.store.color);
    // add new active
    links
      .filter((link) => activeLinks.has(link))
      .attr('fill', (d) => d.store.activeColor)
      .each((d) => (d.store.active = true));
  };

// ========== private common actions ==========
// interface LinksActionProps {
//   // color
//   activeColor: boolean;
//   // update state
//   active?: boolean;
// }
// const linksAction = (links: LinksSelection) => {

// };
