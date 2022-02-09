import * as d3 from 'd3';
import { D3DragEvent } from 'd3';

import { EntityType, ViewPointType } from '@views/Main/state/okrDB/type';
import { PlainFn } from '@utils/type';
import {
  ItemsRefObj,
  LinkColor,
  LinkColorOpacity,
  LinksSelection,
  MouseActionType,
  NodeActionCallback,
  NodeColor,
  NodeDragCallback,
  NodeDragType,
  NodeImageMaskOpacity,
  NodeImagePadding,
  NodeRadius,
  NodesSelection,
  NodeState,
  NodeStrokeWidth,
  NodeTextColor,
  NodeTextSize,
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
    const calcRadius = ({ data: { type }, store: { relative } }: PathNode) => {
      if (relative) {
        return NodeRadius.RelativeUser;
      }

      return map[type] || NodeRadius.Todo;
    };

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
    const isRelative = d.store.relative;
    if (type !== EntityType.User) {
      // image only for user
      return 0;
    }

    let width: number, padding: NodeImagePadding;
    if (isRelative) {
      padding = NodeImagePadding.L3;
      width = (NodeRadius.RelativeUser - padding) * 2;
    } else if (viewPointType === ViewPointType.Organization) {
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
  const { type, id, seq } = d.data;
  let text: string, fontSize: number;
  if (
    viewPointType === ViewPointType.Organization ||
    ![EntityType.O, EntityType.KR].includes(type)
  ) {
    // 组织视图 / 非 O,KR 节点
    text = '';
    fontSize = NodeTextSize.Hidden;
  } else {
    // 个人视图
    text = `${type}${seq}`;
    if (type === EntityType.O) {
      // + O 节点
      fontSize = NodeTextSize.O;
    } else if (type === EntityType.KR) {
      // + KR 节点
      fontSize = NodeTextSize.KR;
    } else {
      // + 其他节点
      fontSize = NodeTextSize.Default;
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

    linksRef.current
      .select('line')
      .attr('x1', (d) => (d.source as PathNode).x)
      .attr('y1', (d) => (d.source as PathNode).y)
      .attr('x2', (d) => (d.target as PathNode).x)
      .attr('y2', (d) => (d.target as PathNode).y);

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
  // console.log(`[onEnd] simulation end: alpha = ${simulation.alpha()}`);
};

// ========== node drag ==========
/**
 * 节点拖拽
 */
export const onDrag = (
  simulation: d3.Simulation<PathNode, any>,
  cb?: NodeDragCallback,
) => {
  let dragging = false;
  let startX: number, startY: number;

  const dragStart = (e: D3DragEvent<any, PathNode, PathNode>, d: PathNode) => {
    cb && cb(NodeDragType.Down, e.sourceEvent, d);
    if (!d.draggable) {
      return;
    }
    const { x, y } = d;
    // store origin x,y
    startX = d.fx = x;
    startY = d.fy = y;
  };

  const dragDrag = (e: D3DragEvent<any, PathNode, PathNode>, d: PathNode) => {
    cb && cb(NodeDragType.Move, e.sourceEvent, d);
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

  const dragEnd = (e: D3DragEvent<any, PathNode, PathNode>, d: PathNode) => {
    cb && cb(NodeDragType.Up, e.sourceEvent, d);
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
  (e: MouseEvent) => {
    updateItems({ linksRef, nodesRef }, MouseActionType.Clear);

    cb && cb();
  };

// ========== node hover/click ==========
/**
 * 节点 hover
 *   关联边着色
 */
export const onEnterNode =
  ({ linksRef, nodesRef }: TickBindRefs, cb?: NodeActionCallback) =>
  (e: MouseEvent, targetNode: PathNode) => {
    updateItems({ linksRef, nodesRef }, MouseActionType.Enter, targetNode);
    cb && cb(targetNode, e);
  };

export const onLeaveNode =
  ({ linksRef, nodesRef }: TickBindRefs, cb?: NodeActionCallback) =>
  (e: MouseEvent, targetNode: PathNode) => {
    updateItems({ linksRef, nodesRef }, MouseActionType.Leave, targetNode);
    cb && cb(targetNode, e);
  };

/**
 * 节点 click
 *   节点着色
 *   link active 状态 = true
 */
export const onClickNode =
  ({ linksRef, nodesRef }: TickBindRefs, cb?: NodeActionCallback) =>
  (e: MouseEvent, targetNode: PathNode) => {
    if (targetNode.store.relative === EntityType.O) {
      const sourceO = linksRef.current
        .data()
        .find((link) => link.target === targetNode).source as PathNode;
      if (!sourceO) {
        console.warn(`[onClickNode] source not found for`, targetNode);
      } else {
        targetNode = sourceO;
      }
    }

    updateItems({ linksRef, nodesRef }, MouseActionType.Click, targetNode);

    // invoke callback
    cb && cb(targetNode, e);
  };

// ========== private common actions ==========
/**
 * 计算目标关联 Node & Link(主要)
 */
const calcRelativeItems = (
  links: PathLink[],
  targetNode?: PathNode,
): {
  relativeLinkSet: Set<PathLink>;
  relativeNodeSet: Set<PathNode>;
} => {
  const relativeLinkSet: Set<PathLink> = new Set();
  const relativeNodeSet: Set<PathNode> = new Set();
  if (!targetNode) {
    // when mouse action === Clear
    return {
      relativeLinkSet,
      relativeNodeSet,
    };
  }

  const nodeId = targetNode.id;
  let parentId: string = null;

  // targetId => sourceId
  const relationMap = {};

  // 1. check all links(calc children)
  links.forEach((link) => {
    if (link.additional) {
      return;
    }
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
      relativeLinkSet.add(link);
      relativeNodeSet.add(link.target as PathNode);
    }

    relationMap[targetId] = sourceId;
  });

  // 2. calc ancestors
  const inheritIds: Set<string> = new Set([nodeId]);
  while (parentId !== null) {
    inheritIds.add(parentId);
    parentId = relationMap[parentId] || null; // null if not exists
  }

  // append links between self & ancestor
  links.forEach((link) => {
    if (
      inheritIds.has((link.source as PathNode).id) &&
      inheritIds.has((link.target as PathNode).id)
    ) {
      relativeLinkSet.add(link);
      relativeNodeSet.add(link.source as PathNode);
    }
  });
  // add targetNode
  relativeNodeSet.add(targetNode);

  return {
    relativeLinkSet,
    relativeNodeSet,
  };
};

/**
 * 更新 Node & Link 状态/颜色
 */
const updateItems = (
  items: ItemsRefObj,
  action: MouseActionType,
  targetNode?: PathNode,
) => {
  // 所有物件
  const {
    linksRef: { current: links },
    nodesRef: { current: nodes },
  } = items;

  // 关联物件集合
  const { relativeLinkSet, relativeNodeSet } = calcRelativeItems(
    links.data(),
    targetNode,
  );

  // 关联物件
  const isClear = action === MouseActionType.Clear;
  const relativeLinks = isClear
    ? links
    : links.filter((link) => relativeLinkSet.has(link));
  const relativeNodes = isClear
    ? nodes
    : nodes.filter((node) => relativeNodeSet.has(node));

  // 更新
  updateNodes(nodes, relativeNodes, action, targetNode);
  updateLinks(links, relativeLinks, action, nodes, targetNode);
};

const updateNodes = (
  nodes: NodesSelection,
  relativeNodes: NodesSelection,
  action: MouseActionType,
  targetNode?: PathNode,
) => {
  if (action === MouseActionType.Click) {
    /**
     * 1. Click
     */
    _nodesColor(
      nodes.each((d) => (d.store.state = NodeState.Inactive)),
      SelectionType.Inactive,
      targetNode,
    );
    _nodesColor(
      relativeNodes.each((d) => (d.store.state = NodeState.Active)),
      SelectionType.Active,
      targetNode,
    );
  } else if (action === MouseActionType.Enter) {
    /**
     * 2. Enter
     */
    _nodesColor(
      relativeNodes
        .filter((node) => node.store.state !== NodeState.Active)
        .each((d) => (d.store.state = NodeState.Hover)),
      SelectionType.Hover,
      targetNode,
    );
  } else if (action === MouseActionType.Leave) {
    /**
     * 3. Leave
     */
    _nodesColor(
      relativeNodes
        .filter((node) => node.store.state !== NodeState.Active)
        .each((d) => (d.store.state = NodeState.Inactive)),
      SelectionType.Inactive,
      targetNode,
    );
  } else if (action === MouseActionType.Clear) {
    /**
     * 4. Clear
     */
    _nodesColor(
      nodes
        .filter((node) => node.store.state !== NodeState.Inactive)
        .each((d) => (d.store.state = NodeState.Inactive)),
      SelectionType.Inactive,
      targetNode,
    );
  }

  if (targetNode) {
    const {
      data: { type: targetType, id: targetId, originId: targetOriginId },
    } = targetNode;
    const addtionalNodes = nodes.filter((node) => {
      const {
        data: { type, id, originId },
        store: { state },
      } = node;
      return (
        type === targetType &&
        originId === targetOriginId &&
        id !== targetId &&
        state === NodeState.Inactive // 不要选到 active 状态的
      );
    });
    _additionalNodesColor(nodes, addtionalNodes, action);
  } else {
    _additionalNodesColor(nodes, null, action);
  }
};

/**
 * 改变 node 颜色
 */
const _nodesColor = (
  nodes: NodesSelection,
  type: SelectionType,
  targetNode?: PathNode,
) => {
  if (nodes.size() === 0) {
    return;
  }
  if (type === SelectionType.Active) {
    // active
    nodes
      .select('circle')
      .attr('fill', (d) =>
        d === targetNode ? d.store.activeColor : d.store.hoverColor,
      );
    nodes.select('text').attr('fill', NodeTextColor.Active);
    nodes
      .select('circle.user-mask')
      .attr('opacity', NodeImageMaskOpacity.Active);

    const itemNodes = nodes.filter((d) => d.data.type !== EntityType.User);
    itemNodes
      .filter((d) => d === targetNode)
      .select('circle')
      .attr('stroke-width', (d) => d.store.strokeWidth);
  } else if (type === SelectionType.Hover) {
    // hover (active 覆盖 hover 状态)
    nodes = nodes.filter((node) => node.store.state !== NodeState.Active);

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

const _additionalNodesColor = (
  nodes: NodesSelection,
  addtionalNodes: NodesSelection | null,
  action: MouseActionType,
) => {
  const currentHoverNodes = nodes.filter((node) => {
    const {
      store: { additional, state },
    } = node;
    return additional && state === NodeState.Inactive;
  });

  if (action === MouseActionType.Click) {
    // 颜色 + 状态
    // 清理旧节点
    currentHoverNodes
      .each((d) => (d.store.additional = false))
      .select('circle')
      .attr('fill', (d) => d.store.color);
    // 涂上新节点
    addtionalNodes
      .each((d) => (d.store.additional = true))
      .select('circle')
      .attr('fill', (d) => d.store.hoverColor);
  } else if (action === MouseActionType.Enter) {
    // 暂时删除 active 节点颜色
    currentHoverNodes.select('circle').attr('fill', (d) => d.store.color);
    // 涂上关联节点颜色
    addtionalNodes &&
      addtionalNodes.select('circle').attr('fill', (d) => d.store.hoverColor);
  } else if (action === MouseActionType.Leave) {
    // 清理关联节点颜色
    addtionalNodes &&
      addtionalNodes.select('circle').attr('fill', (d) => d.store.color);
    // 重新涂上 active 节点颜色
    currentHoverNodes.select('circle').attr('fill', (d) => d.store.hoverColor);
  } else if (action === MouseActionType.Clear) {
    // 清理状态 & 颜色
    currentHoverNodes
      .each((d) => (d.store.additional = false))
      .select('circle')
      .attr('fill', (d) => d.store.color);
  }
};

/**
 * 更新 link 状态
 */
const updateLinks = (
  links: LinksSelection,
  relativeLinks: LinksSelection,
  action: MouseActionType,
  nodes: NodesSelection,
  targetNode?: PathNode,
) => {
  // 处理主要边
  if (action === MouseActionType.Click) {
    /**
     * 1. Click
     */
    // 重置全部状态 & 颜色
    _linksColor(
      links
        .filter((link) => link.store.active)
        .each((d) => (d.store.active = false)),
      false,
    );
    // 激活目标边
    _linksColor(
      relativeLinks.each((d) => (d.store.active = true)),
      true,
    );
  } else if (action === MouseActionType.Enter) {
    /**
     * 2. Enter
     */
    // 全部上色
    _linksColor(relativeLinks, true);
  } else if (action === MouseActionType.Leave) {
    /**
     * 3. Leave
     */
    // inactive 去色
    _linksColor(
      relativeLinks.filter((link) => !link.store.active),
      false,
    );
  } else if (action === MouseActionType.Clear) {
    /**
     * 4. Clear
     */
    // 重置全部状态 & 颜色
    _linksColor(
      links
        .filter((link) => link.store.active)
        .each((d) => (d.store.active = false)),
      false,
    );
  }

  // 处理额外边
  _addtionalLinksColor(links, nodes, action, targetNode);
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

/**
 * 额外关系（O-O 关系）颜色
 */
const _addtionalLinksColor = (
  links: LinksSelection,
  nodes: NodesSelection,
  action: MouseActionType,
  targetNode?: PathNode,
) => {
  links.select('line').attr('stroke', LinkColor.Hidden);

  // calc addtional links & collect nodes
  const additionalNodesSet = new Set<PathNode>(); // node => link.active
  const additionalLinks = links
    .filter((d) => d.source === targetNode)
    .each((d) => additionalNodesSet.add(d.target as PathNode));
  const additionalNodes = nodes
    .filter((node) => additionalNodesSet.has(node))
    .filter((node) => node.store.state !== NodeState.Active);

  if (action === MouseActionType.Click) {
    // active state = true & draw color
    additionalLinks
      .each((d) => (d.store.active = true))
      .select('line')
      .attr('stroke', LinkColor.AddtionalOO);
    _nodesColor(
      additionalNodes.each((d) => (d.store.state = NodeState.Additional)),
      SelectionType.Hover,
      targetNode,
    );
  } else if (action === MouseActionType.Enter) {
    // draw color only
    additionalLinks.select('line').attr('stroke', LinkColor.AddtionalOO);

    // 暂时清理 additional 的 nodes
    _nodesColor(
      nodes.filter((d) => d.store.state === NodeState.Additional),
      SelectionType.Inactive,
      targetNode,
    );

    _nodesColor(additionalNodes, SelectionType.Hover);
  } else if (action === MouseActionType.Leave) {
    // redraw active links
    links
      .filter((d) => d.store.active)
      .select('line')
      .attr('stroke', LinkColor.AddtionalOO);

    _nodesColor(
      additionalNodes
        .filter((d) => d.store.state !== NodeState.Additional)
        .each((d) => (d.store.state = NodeState.Inactive)),
      SelectionType.Inactive,
      targetNode,
    );

    // 恢复 additional 的 nodes
    _nodesColor(
      nodes.filter((d) => d.store.state === NodeState.Additional),
      SelectionType.Hover,
      targetNode,
    );
  } else if (action === MouseActionType.Clear) {
  } else {
    console.error(`[_addtionalLinksColor] unknonw selection type: ${action}`);
  }
};
