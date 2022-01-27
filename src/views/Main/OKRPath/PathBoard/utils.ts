import * as d3 from 'd3';

import { EntityType, ViewPointType } from '@views/Main/state/okrDB/type';
import { PlainFn } from '@utils/type';
import {
  ClickNodeCallback,
  LinkColor,
  LinkColorOpacity,
  LinksSelection,
  NodeColor,
  NodeImageMaskOpacity,
  NodeImagePadding,
  NodeRadius,
  NodesSelection,
  NodeStrokeWidth,
  NodeTextColor,
  PathLink,
  PathNode,
  RootSelection,
  SelectionType,
  TickBindRefs,
} from './type';

// ========== style / init props ==========
/**
 * 节点半径
 *   calc radius
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
          return NodeRadius.KR; // 组织视图 O.radius = 17
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

/**
 *
 */
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
 *   calc color
 *        activeColor
 */
interface CalcNodeColor {
  (d: PathNode): string;
}
const _nodeColorMap: {
  [type in EntityType]: {
    color: NodeColor;
    hoverColor: NodeColor;
    activeColor: NodeColor;
  };
} = {
  [EntityType.User]: {
    color: NodeColor.User,
    hoverColor: NodeColor.User,
    activeColor: NodeColor.User,
  },
  [EntityType.O]: {
    color: NodeColor.O,
    hoverColor: NodeColor.HoverO,
    activeColor: NodeColor.ActiveO,
  },
  [EntityType.KR]: {
    color: NodeColor.KR,
    hoverColor: NodeColor.HoverKR,
    activeColor: NodeColor.ActiveKR,
  },
  [EntityType.Project]: {
    color: NodeColor.Project,
    hoverColor: NodeColor.HoverProject,
    activeColor: NodeColor.ActiveProject,
  },
  [EntityType.Todo]: {
    color: NodeColor.Todo,
    hoverColor: NodeColor.HoverTodo,
    activeColor: NodeColor.ActiveTodo,
  },
};
export const nodeColor: CalcNodeColor = (d: PathNode) => {
  const { color, hoverColor, activeColor } = _nodeColorMap[d.data.type];
  d.store.color = color;
  d.store.hoverColor = hoverColor;
  d.store.activeColor = activeColor;
  return color;
};

/**
 * 节点描边宽度
 */
const _nodeStrokeWidthMap: { [type in EntityType]: NodeStrokeWidth } = {
  [EntityType.User]: NodeStrokeWidth.Inactive,
  [EntityType.O]: NodeStrokeWidth.O,
  [EntityType.KR]: NodeStrokeWidth.KR,
  [EntityType.Project]: NodeStrokeWidth.Project,
  [EntityType.Todo]: NodeStrokeWidth.Todo,
};
export const nodeStrokeWidth = (node: PathNode) => {
  const strokeWidth = _nodeStrokeWidthMap[node.data.type];
  node.store.strokeWidth = strokeWidth;
  return strokeWidth;
};

/**
 * 节点文字
 *   calc text
 */
export const nodeText = (viewPointType: ViewPointType) => (d: PathNode) => {
  const { type, id } = d.data;
  let text: string, fontSize: number;
  if (
    viewPointType === ViewPointType.Organization ||
    ![EntityType.O, EntityType.KR].includes(type)
  ) {
    text = '';
    fontSize = 12;
  } else {
    text = `${type}${id.split('-')[1]}`;
    if (type === EntityType.O) {
      fontSize = 16;
    } else if (type === EntityType.KR) {
      fontSize = 12;
    } else {
      fontSize = 12;
    }
  }

  d.store.text = text;
  d.store.fontSize = fontSize;

  return text;
};

/**
 * 关系填充色
 *   calc activeColorStart
 *        activeColorEnd
 */
const _linkSideColorMap: { [type in EntityType]: LinkColor } = {
  [EntityType.User]: LinkColor.UserSide,
  [EntityType.O]: LinkColor.OSide,
  [EntityType.KR]: LinkColor.KRSide,
  [EntityType.Project]: LinkColor.ProjectSide,
  [EntityType.Todo]: LinkColor.TodoSide,
};
export const linkColor = (
  d: PathLink,
  nodeMap: { [nodeId: string]: PathNode },
) => {
  const t1 = nodeMap[d.source as string].data.type;
  const t2 = nodeMap[d.target as string].data.type;

  d.store.activeColorStart = _linkSideColorMap[t1];
  d.store.activeColorEnd = _linkSideColorMap[t2];
};

/**
 * 计算 link Id
 *   calc id
 *        colorId
 */
export const linkId = (link: PathLink) => {
  const linkId = (link.store.id = `link-${link.source}-${link.target}`);
  link.store.colorId = `${linkId}-color`;
};

// ========== common style ==========
export const transition = (attr: string, duration: number = 0.2) =>
  `${attr} ${duration}s`;

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
      .select('path')
      .attr('transform', (d) => {
        const { x1, y1, angle, scale } = d.store;
        return `translate(${x1},${y1}) rotate(${angle}) scale(${scale},1)`;
      });

    nodesRef.current
      .select('circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);

    nodesRef.current
      .select('circle.user-mask')
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
  let startX: number, startY: number;

  const dragStart = (e, d: PathNode) => {
    if (!d.draggable) {
      return;
    }
    const { x, y } = d;
    // store origin x,y
    startX = d.fx = x;
    startY = d.fy = y;
  };

  const dragDrag = (e, d: PathNode) => {
    if (!d.draggable) {
      return;
    }
    const { x, y } = e;
    const distance = (x - startX) ** 2 + (y - startY) ** 2;
    if (distance < 100) {
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
  ({ linksRef, nodesRef }: TickBindRefs, cb?: PlainFn) =>
  (e: MouseEvent, d: PathNode) => {
    // clear all active
    _linksColor(
      linksRef.current
        .filter((link) => link.store.active)
        .each((d) => (d.store.active = false)),
      false,
    );
    _nodesColor(
      nodesRef.current
        .filter((node) => node.store.active)
        .each((d) => (d.store.active = false)),
      SelectionType.Inactive,
    );

    cb && cb();
  };

// ========== node hover/click ==========
/**
 * 节点 hover
 *   关联边着色
 */
const calcRelativeItems = (
  targetNode: PathNode,
  links: PathLink[],
): {
  relativeLinks: Set<PathLink>;
  relativeNodes: Set<PathNode>;
} => {
  const nodeId = targetNode.id;
  const relativeLinks: Set<PathLink> = new Set();
  const relativeNodes: Set<PathNode> = new Set();
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
        console.warn(`multiple source for one node: ${nodeId}`);
      }
      parentId = sourceId;
    }

    // append child
    if (sourceId === nodeId) {
      relativeLinks.add(link);
      relativeNodes.add(link.target as PathNode);
    }

    relationMap[targetId] = sourceId;
  });

  // 2. calc ancestors
  const inheritIds: Set<string> = new Set([nodeId]);
  while (parentId !== null) {
    inheritIds.add(parentId);
    parentId = relationMap[parentId] || null; // null if not exists
  }

  // append self & ancestor
  links.forEach((link) => {
    if (
      inheritIds.has((link.source as PathNode).id) &&
      inheritIds.has((link.target as PathNode).id)
    ) {
      relativeLinks.add(link);
      relativeNodes.add(link.source as PathNode);
    }
  });
  relativeNodes.add(targetNode);

  return {
    relativeLinks,
    relativeNodes,
  };
};
export const onEnterNode =
  ({ linksRef, nodesRef }: TickBindRefs) =>
  (e: MouseEvent, d: PathNode) => {
    const { relativeLinks, relativeNodes } = calcRelativeItems(
      d,
      linksRef.current.data(),
    );
    // fill activeColor
    _linksColor(
      linksRef.current.filter((link) => relativeLinks.has(link)),
      true,
    );
    _nodesColor(
      nodesRef.current.filter((node) => relativeNodes.has(node)),
      SelectionType.Hover,
    );
  };

export const onLeaveNode =
  ({ linksRef, nodesRef }: TickBindRefs) =>
  (e: MouseEvent, d: PathNode) => {
    const { relativeLinks, relativeNodes } = calcRelativeItems(
      d,
      linksRef.current.data(),
    );
    // remove activeColor
    _linksColor(
      linksRef.current
        .filter((link) => relativeLinks.has(link))
        .filter((link) => !link.store.active), // recover unactive link
      false,
    );
    _nodesColor(
      nodesRef.current
        .filter((node) => relativeNodes.has(node))
        .filter((node) => !node.store.active),
      SelectionType.Inactive,
    );
  };

/**
 * 节点 click
 *   节点着色
 *   link active 状态 = true
 */
export const onClickNode =
  ({ linksRef, nodesRef }: TickBindRefs, cb?: ClickNodeCallback) =>
  (e: MouseEvent, d: PathNode) => {
    const { relativeLinks, relativeNodes } = calcRelativeItems(
      d,
      linksRef.current.data(),
    );

    /**
     * 1. 关系 active
     */
    const links = linksRef.current;
    _linksColor(
      links
        .filter((link) => link.store.active)
        .each((d) => (d.store.active = false)),
      false,
    );
    _linksColor(
      links
        .filter((link) => relativeLinks.has(link))
        .each((d) => (d.store.active = true)),
      true,
    );

    /**
     * 2. 节点 active
     */
    const nodes = nodesRef.current;
    _nodesColor(
      nodes
        .filter((node) => node.store.active)
        .each((d) => (d.store.active = false)),
      SelectionType.Inactive,
    );
    _nodesColor(
      nodes
        .filter((node) => relativeNodes.has(node))
        .each((d) => (d.store.active = true)),
      SelectionType.Active,
    );

    // invoke callback
    cb && cb(d);
  };

// ========== private common actions ==========
/**
 * 改变 node 颜色
 */
const _nodesColor = (nodes: NodesSelection, type: SelectionType) => {
  if (nodes.size() === 0) {
    return;
  }
  if (type === SelectionType.Active) {
    // active
    nodes.select('circle').attr('fill', (d) => d.store.activeColor);
    nodes.select('text').attr('fill', NodeTextColor.Active);
    nodes
      .select('circle.user-mask')
      .attr('opacity', NodeImageMaskOpacity.Active);

    const itemNodes = nodes.filter((d) => d.data.type !== EntityType.User);
    itemNodes.select('circle').attr('stroke-width', (d) => d.store.strokeWidth);
  } else if (type === SelectionType.Hover) {
    // hover (active 覆盖 hover 状态)
    nodes = nodes.filter((node) => !node.store.active);

    nodes.select('circle').attr('fill', (d) => d.store.hoverColor);
    nodes.select('text').attr('fill', NodeTextColor.Active);
    nodes
      .select('circle.user-mask')
      .attr('opacity', NodeImageMaskOpacity.Hover);
  } else if (type === SelectionType.Inactive) {
    // inactive
    nodes.select('circle').attr('fill', (d) => d.store.color);
    nodes.select('text').attr('fill', NodeTextColor.Inactive);
    nodes
      .select('circle.user-mask')
      .attr('opacity', NodeImageMaskOpacity.Inactive);

    const itemNodes = nodes.filter((d) => d.data.type !== EntityType.User);
    itemNodes.select('circle').attr('stroke-width', NodeStrokeWidth.Inactive);
  } else {
    console.error(`[_nodesColor] unknonw selection type: ${type}`);
  }
};

/**
 * 改变 link 颜色
 */
const _linksColor = (links: LinksSelection, active: boolean) => {
  if (links.size() === 0) {
    return;
  }
  const gradients = links.select('linearGradient');
  if (active) {
    // 激活 link
    gradients
      .select('stop[offset="0%"]')
      .attr('stop-color', (d) => d.store.activeColorStart)
      .attr('stop-opacity', LinkColorOpacity.Active);
    gradients
      .select('stop[offset="100%"]')
      .attr('stop-color', (d) => d.store.activeColorEnd)
      .attr('stop-opacity', LinkColorOpacity.Active);
  } else {
    // 取消激活 link
    gradients
      .selectAll('stop')
      .attr('stop-color', LinkColor.Inactive)
      .attr('stop-opacity', LinkColorOpacity.Inactive);
  }
};
