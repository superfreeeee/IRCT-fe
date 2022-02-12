import React, {
  ForwardRefExoticComponent,
  MutableRefObject,
  RefAttributes,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import * as d3 from 'd3';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  EntityType,
  ProjectType,
  TodoStatus,
  ViewPointType,
} from '@views/Main/state/okrDB/type';
import {
  activeNodeState,
  okrPathListVisibleState,
  tooltipDataState,
  tooltipPositionState,
  tooltipVisibleState,
  viewPointCenterUserIdState,
  viewPointStackUpdater,
  viewPointTypeState,
} from '@views/Main/state/okrPath';
import {
  EditEntityModalActionType,
  EditEntityModalResponseStatus,
  EditEntityModalResultPayload,
  ViewPointStackActionType,
} from '@views/Main/state/type';
import {
  contextMenuPositionState,
  contextMenuTargetState,
  contextMenuVisibleState,
} from '@views/Main/state/modals/customContextMenu';
import useClosestRef from '@hooks/useClosestRef';
import { deepCopy } from '@utils';
import {
  BoundNodeAction,
  DragBehavior,
  ForceLinks,
  ForceSimulation,
  LinkColor,
  LinkColorOpacity,
  LinksSelection,
  NodeActionCallback,
  NodeImageMaskOpacity,
  NodesSelection,
  NodeStrokeWidth,
  NodeTextColor,
  PathBoardSource,
  PathNode,
  RootSelection,
  SVGSelection,
  TickBindRefs,
  TransZoomBehavior,
} from './type';
import {
  isTargetNode,
  onClickNode,
  onDrag,
  onEnd,
  onEnterNode,
  onLeaveNode,
  onMaskClick,
  onTick,
  onTransZoom,
  transition,
} from './utils';
import { PathBoardContainer } from './styles';
import {
  editEntityModalActionTypeState,
  editEntityModalResultState,
  editEntityModalSourceState,
  editEntityModalTargetTypeState,
  editEntityModalVisibleState,
} from '@views/Main/state/modals/editEntityModal';
import useWaitFor from '@hooks/useWaitFor';
import {
  deleteTodo,
  editKR,
  editO,
  editProject,
  editTodo,
} from '@views/Main/state/okrDB/crud';

export interface PathBoardRef {
  resetZoom: () => void;
  enterNode: (nodeId: string) => void;
  leaveNode: (nodeId: string) => void;
  clickNode: (nodeId: string) => void;
}

export interface PathBoardProps {
  source: PathBoardSource;
  containerRef: MutableRefObject<HTMLDivElement>;
}

const DEFAULT_SOURCE: PathBoardSource = {
  nodes: [],
  links: [],
};

const PathBoard: ForwardRefExoticComponent<
  PathBoardProps & RefAttributes<PathBoardRef>
> = React.forwardRef(({ source = DEFAULT_SOURCE, containerRef }, ref) => {
  // =============== state ===============
  const viewPointType = useRecoilValue(viewPointTypeState);
  const viewPointTypeRef = useClosestRef(viewPointType);
  const centerUserId = useRecoilValue(viewPointCenterUserIdState);
  const centerUserIdRef = useClosestRef(centerUserId);

  // =============== refs ===============
  const boardContainerRef = useRef<HTMLDivElement>(null);

  // svg elements selections
  const svgRef = useRef<SVGSelection>(null);
  const rootRef = useRef<RootSelection>(null);
  const linksRef = useRef<LinksSelection>(null);
  const nodesRef = useRef<NodesSelection>(null);

  // bound callback
  const simulationRef = useRef<ForceSimulation>(null);
  const forceLinksRef = useRef<ForceLinks>(null);

  const boundMaskClickRef = useRef<(e: MouseEvent) => void>(null);
  const boundTransZoomRef = useRef<TransZoomBehavior>(null);
  const boundEnterNodeRef = useRef<BoundNodeAction>(null);
  const boundLeaveNodeRef = useRef<BoundNodeAction>(null);
  const boundClickNodeRef = useRef<BoundNodeAction>(null);
  const boundDragRef = useRef<DragBehavior>(null);

  // =============== actions ===============
  /**
   * 重置成合适的缩放、中心用户平移到中央
   */
  const resetZoom = useCallback(() => {
    const centerUserCircle = nodesRef.current
      .filter((d) => d.data.id === centerUserIdRef.current)
      .select('circle');

    const x = centerUserCircle.attr('cx');
    const y = centerUserCircle.attr('cy');

    svgRef.current
      ?.transition()
      .duration(750)
      .call(
        boundTransZoomRef.current.transform,
        d3.zoomIdentity.scale(1).translate(-x, -y),
      );
  }, []);

  /**
   * 点击节点后外部事件(处理节点焦点)
   */
  const lastClickItemIdRef = useRef<string>('');
  const updateStack = useSetRecoilState(viewPointStackUpdater);
  const setOkrPathListVisible = useSetRecoilState(okrPathListVisibleState);
  const [activeNode, setActiveNode] = useRecoilState(activeNodeState);
  const activeNodeLive = useClosestRef(activeNode);
  const handleClickNode: NodeActionCallback = useCallback(
    (node: PathNode, e: MouseEvent) => {
      isDraggingRef.current = false; // 点击事件也允许清理

      const currentId = node.id;
      const lastId = lastClickItemIdRef.current;

      const isCurrentOrg =
        viewPointTypeRef.current === ViewPointType.Organization;

      /**
       * 单击节点
       */
      // 1. 个人视图 => 展开 List 页面, 保存 active 状态
      if (!isCurrentOrg) {
        setOkrPathListVisible(true);
        setActiveNode(deepCopy(node));
      }

      if (lastId === currentId) {
        /**
         * 双击节点
         */
        if (isCurrentOrg && node.data.type === EntityType.User) {
          // 1. 组织视图 + 双击人物  => 切换到个人视图
          updateStack({
            type: ViewPointStackActionType.Push,
            record: {
              type: ViewPointType.Personal,
              centerUserId: currentId,
            },
          });
        }
      } else {
        /**
         * 单击节点（首次）
         */
        lastClickItemIdRef.current = currentId;

        updateRelativeUsers(node);
      }
    },
    [],
  );
  const clearLastClickItemId = useCallback(() => {
    lastClickItemIdRef.current = '';
  }, []);
  const handleClickMask = useCallback(() => {
    clearLastClickItemId();
    if (activeNodeLive.current === null) {
      // activeNode 为 null 的情况下再点一次
      //   => 关闭 path list
      setOkrPathListVisible(false);
    } else {
      setActiveNode(null);
      updateRelativeUsers();
    }
  }, []);
  // 更新视图的时候重置
  useEffect(clearLastClickItemId, [source]);

  // =============== relativeUsers 渲染相关 ===============
  const sourceRef = useClosestRef(source);

  const updateRelativeUsers = useCallback((targetNode?: PathNode) => {
    const { nodes, links } = sourceRef.current;

    if (targetNode) {
      const targetNodeId = targetNode.id;
      const activeNodeIdSet = new Set<string>();

      // extract target(active) nodes/links
      const activeLinks = links
        .filter(
          ({ relative, source }) =>
            relative === EntityType.Project &&
            (source === targetNode || source === targetNodeId),
        )
        .map((link) => {
          if (typeof link.target === 'string') {
            activeNodeIdSet.add(link.target as string);
          } else {
            activeNodeIdSet.add((link.target as PathNode).id);
          }
          return link;
        });
      const activeNodes = nodes.filter((node) => activeNodeIdSet.has(node.id));

      if (activeNodes.length === 0) {
        return;
      }

      // update nodesRef/linksRef
      const originNodesSelection = nodesRef.current;
      const restNodesSelection = originNodesSelection.filter(
        (node) => node.store.relative !== EntityType.Project,
      );
      const newNodes = [...restNodesSelection.data(), ...activeNodes];

      const { x, y } = targetNode;
      nodesRef.current = originNodesSelection.data(newNodes).join(
        (enter) => {
          const selection = enter
            .each((node) => {
              // 初始化坐标
              node.x = x;
              node.y = y;
            })
            .append('g')
            .attr('class', (d) => `node-${d.data.id}`)
            .on('click', (e: MouseEvent) => e.stopPropagation())
            .on('mouseenter', boundEnterNodeRef.current)
            .on('mouseleave', boundLeaveNodeRef.current)
            .on('mousedown', handleMouseDownNode)
            .on('mouseup', handleMouseUpNode)
            .call(boundDragRef.current);

          selection
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', (d) => d.store.radius)
            .attr('fill', (d) => d.store.color)
            .style('transition', transition('fill'));

          selection
            .append('image')
            .attr('x', x)
            .attr('y', y)
            .attr('width', (d) => d.store.imageWidth)
            .attr('height', (d) => d.store.imageWidth)
            // @ts-ignore
            .attr('xlink:href', (d) => d.data.avatar)
            // @ts-ignore
            .attr('src', (d) => d.data.avatar)
            .attr('transform', (d) => {
              const { radius: r, imagePadding: pad } = d.store;
              const offset = -r + pad;
              return `translate(${offset}, ${offset})`;
            })
            .attr('clip-path', (d) => `url(#node-${d.data.id}-circle)`);

          selection
            .append('circle')
            .attr('class', 'user-mask')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', (d) => d.store.radius)
            .attr('fill', 'black')
            .attr('opacity', NodeImageMaskOpacity.Inactive)
            .style('transition', transition('opacity'));

          return selection;
        },
        (update) => update,
        (exit) => {
          exit.remove();
        },
      );

      const originLinksSelection = linksRef.current;
      const restLinksSelection = originLinksSelection.filter(
        (link) => link.relative !== EntityType.Project,
      );
      const newLinks = [...restLinksSelection.data(), ...activeLinks];

      linksRef.current = originLinksSelection.data(newLinks).join(
        (enter) => {
          return enter.append('g').attr('class', (d) => d.store.id);
        },
        (update) => update,
        (exit) => {
          exit.remove();
        },
      );

      // update simulation
      const simulation = simulationRef.current;
      simulation.stop().nodes(newNodes);

      forceLinksRef.current.links(newLinks);

      simulation.alpha(0.5).restart();
    } else {
      const currentNodesSelection = nodesRef.current;
      const removedNodes = currentNodesSelection
        .filter((node) => node.store.relative === EntityType.Project)
        .remove()
        .data().length;

      const currentLinksSelection = linksRef.current;
      const removedLinks = currentLinksSelection
        .filter((link) => link.relative === EntityType.Project)
        .remove()
        .data().length;

      if (removedNodes !== removedLinks) {
        console.warn(
          `[updateRelativeUsers] length not match: nodes = ${removedNodes}, links = ${removedLinks}`,
        );
      }

      if (removedNodes + removedLinks === 0) {
        return;
      }

      const restNodes = (nodesRef.current = currentNodesSelection.filter(
        (node) => node.store.relative !== EntityType.Project,
      ));
      const restLinks = (linksRef.current = currentLinksSelection.filter(
        (link) => link.relative !== EntityType.Project,
      ));

      const simulation = simulationRef.current;
      simulation.nodes(restNodes.data());

      forceLinksRef.current.links(restLinks.data());
    }
  }, []);

  /**
   * hover 时 tooltip
   */
  // =============== tooltip 相关 ===============
  const setTooltipVisible = useSetRecoilState(tooltipVisibleState);
  const setTooltipPosition = useSetRecoilState(tooltipPositionState);
  const setTooltipData = useSetRecoilState(tooltipDataState);
  const handleEnterNode: NodeActionCallback = useCallback(
    (node: PathNode, e: MouseEvent) => {
      if (!e || isDraggingRef.current) {
        // dont show tooltip when trigger outer
        return;
      }
      const nodeEl = nodesRef.current
        .filter((d) => d === node)
        .node() as SVGGElement;

      const { x: dx, height } = containerRef.current.getBoundingClientRect();
      const { x, width, top } = nodeEl.getBoundingClientRect();

      clearTimeout(resetPositionTimer.current);
      setTooltipVisible(true);
      setTooltipPosition({
        left: x - dx + width / 2,
        bottom: height - top + 10,
      });
      setTooltipData(deepCopy(node));
    },
    [],
  );
  const resetPositionTimer = useRef(null);
  const closeTooltip = useCallback(() => {
    setTooltipVisible(false);
    resetPositionTimer.current = setTimeout(() => {
      setTooltipPosition({
        left: 0,
        bottom: 24,
      });
    }, 500);
  }, []);
  const handleLeaveNode: NodeActionCallback = useCallback(() => {
    closeTooltip();
  }, []);

  // =============== customContextMenu 相关 ===============
  /**
   * 右键列表相关
   */
  const isDraggingRef = useRef(false);
  const setContextMenuVisible = useSetRecoilState(contextMenuVisibleState);
  const setContextMenuPosition = useSetRecoilState(contextMenuPositionState);
  const setContextMenuTarget = useSetRecoilState(contextMenuTargetState);
  const handleMouseDownNode = useCallback(
    (e: MouseEvent, targetNode: PathNode) => {
      isDraggingRef.current = true;
      closeTooltip(); // 按下去的時候取消 tooltip 避免閃爍

      if (e.button === 2) {
        // 右键点击事件
        setContextMenuVisible(true);
        setContextMenuTarget(deepCopy(targetNode));
        const { clientX: left, clientY: top } = e;
        setContextMenuPosition({ left, top });

        waitingEditRef.current = true;
      }
    },
    [],
  );
  const handleMouseUpNode = useCallback(
    (e: MouseEvent, targetNode: PathNode) => {
      isDraggingRef.current = false;
      handleEnterNode(targetNode, e); // 拖拽释放后可以重新触发一次
    },
    [],
  );
  // when source change
  useEffect(() => {
    closeTooltip();
    isDraggingRef.current = false;
  }, [source]);

  // =============== editEntityModal 相关 ===============
  const waitingEditRef = useRef(false);
  const editModalVisible = useRecoilValue(editEntityModalVisibleState);
  const editModalActionType = useRecoilValue(editEntityModalActionTypeState);
  const editModalTargetType = useRecoilValue(editEntityModalTargetTypeState);
  const editModalSource = useRecoilValue(editEntityModalSourceState);
  const editModalResult = useRecoilValue(editEntityModalResultState);
  const createNode = (payload: EditEntityModalResultPayload) => {
    console.log(`[PathBoard] createNode, payload:`, payload);
    // update db
    // TODO

    // update graph
    // TODO

    // update inherit tree
    // TODO
  };
  const editNode = (payload: EditEntityModalResultPayload) => {
    console.log(`[PathBoard] editNode, payload:`, payload);
    const {
      entity: { originId, content },
      selectedUsers,
    } = payload;
    // update db
    switch (editModalTargetType) {
      case EntityType.O:
        editO({
          entity: { id: originId as number, content, userId: '' },
          relativeUserIds: selectedUsers.map((user) => user.id),
        });
        break;

      case EntityType.KR:
        editKR({ id: originId as number, content, upperOId: -1 });
        break;

      case EntityType.Project:
        editProject({
          entity: {
            id: originId as number,
            name: content,
            type: ProjectType.Unkonwn,
          },
          relativeUserIds: selectedUsers.map((user) => user.id),
        });
        break;

      case EntityType.Todo:
        editTodo({
          id: originId as number,
          userId: selectedUsers[0].id,
          name: content,
        });
        break;

      case EntityType.User:
        console.warn(`[PathBoard] editNode: unsable to edit user`, payload);
      default:
        break;
    }

    // update graph
    // TODO

    // update inherit tree
    // TODO
  };
  const deleteNode = () => {
    const {
      data: { type, originId },
    } = editModalSource;

    // update db
    if (type === EntityType.Todo) {
      // 1. Delete Todo
      deleteTodo(originId as number);
    } else {
      //
      console.warn(
        `[PathBoard] deleteNode: current only support delete Todo, targetType=${type}`,
      );
    }

    const boundIsTargetNode = isTargetNode({
      type,
      originId: originId as number,
    });

    // update graph
    if (activeNode.data.originId === originId) {
      // 删除当前 active 节点
      boundMaskClickRef.current(null);
    }

    linksRef.current
      .filter((d) => boundIsTargetNode(d.target as PathNode))
      .remove();
    const restLinksSelection = (linksRef.current = linksRef.current.filter(
      (d) => !boundIsTargetNode(d.target as PathNode),
    ));
    nodesRef.current.filter(boundIsTargetNode).remove();
    const restNodesSelection = (nodesRef.current = nodesRef.current.filter(
      (d) => !boundIsTargetNode(d),
    ));

    forceLinksRef.current.links(restLinksSelection.data());
    simulationRef.current.nodes(restNodesSelection.data()).alpha(0.2).restart();

    // update inherit tree
    // TODO
  };
  useWaitFor(
    !editModalVisible,
    () => {
      console.log(`[PathBoard] status ${editModalResult.status}`);
      switch (editModalResult.status) {
        case EditEntityModalResponseStatus.Confirm:
          if (editModalActionType === EditEntityModalActionType.Create) {
            createNode(editModalResult.payload);
          } else if (editModalActionType === EditEntityModalActionType.Edit) {
            editNode(editModalResult.payload);
          } else if (editModalActionType === EditEntityModalActionType.Delete) {
            deleteNode();
          } else {
            console.warn(
              `[PathBoard] unknown action type ${editModalActionType}`,
            );
          }
          waitingEditRef.current = false;
          break;

        case EditEntityModalResponseStatus.Waiting:
          return; // keep waiting

        default:
          console.warn(`[PathBoard] unknown status ${editModalResult.status}`);
        case EditEntityModalResponseStatus.Cancel:
          waitingEditRef.current = false;
          break;
      }
    },
    waitingEditRef.current,
  );

  // =============== outer actions ===============
  /**
   * 外部操作
   */
  useImperativeHandle(
    ref,
    () => {
      const findNode = (nodeId: string) => {
        return nodesRef.current.data().find((node) => node.id === nodeId);
      };

      const enterNode = (nodeId: string) => {
        const targetNode = findNode(nodeId);
        if (targetNode) {
          boundEnterNodeRef.current(null, targetNode);
        } else {
          console.error(`[PathBoard.enterNode] unknown id: ${nodeId}`);
        }
      };
      const leaveNode = (nodeId: string) => {
        const targetNode = findNode(nodeId);
        if (targetNode) {
          boundLeaveNodeRef.current(null, targetNode);
        } else {
          console.error(`[PathBoard.leaveNode] unknown id: ${nodeId}`);
        }
      };
      const clickNode = (nodeId: string) => {
        const targetNode = findNode(nodeId);
        if (targetNode) {
          boundClickNodeRef.current(null, targetNode);
        } else {
          console.error(`[PathBoard.clickNode] unknown id: ${nodeId}`);
        }
      };
      return { resetZoom, enterNode, leaveNode, clickNode };
    },
    [],
  );

  // =============== effects ===============
  /**
   * 初始化
   *   阻止默认 contextmenu 事件
   */
  useEffect(() => {
    const recent = document.oncontextmenu;
    const instead = (e: MouseEvent) => e.preventDefault();

    document.oncontextmenu = instead;
    () => {
      document.oncontextmenu = recent;
    };
  }, []);

  /**
   * 数据变动时重新渲染
   */
  useEffect(() => {
    // TODO clear console
    console.group(`[PathBoard] source change`);
    console.log(`source(isDefault = ${source === DEFAULT_SOURCE})`, source);
    console.groupEnd();

    if (source === DEFAULT_SOURCE) {
      return;
    }

    const { nodes: sourceNodes, links: sourceLinks } = source;
    const displayNodeIdSet = new Set<string>();
    const nodes = sourceNodes
      .filter((node) => node.store.relative !== EntityType.Project)
      .map((node) => {
        displayNodeIdSet.add(node.id);
        return node;
      });
    const links = sourceLinks.filter(
      (link) =>
        displayNodeIdSet.has(link.source as string) &&
        displayNodeIdSet.has(link.target as string),
    );

    // render
    const { width, height } = boardContainerRef.current.getBoundingClientRect();

    const boardWidth = width;
    const boardHeight = height;

    // refs for function binding
    const tickBindRefs: TickBindRefs = {
      linksRef,
      nodesRef,
    };

    // clear last binding
    if (svgRef.current) {
      svgRef.current.remove();
    }

    /**
     * svg Element
     */
    const boundMaskClick = (boundMaskClickRef.current = onMaskClick(
      tickBindRefs,
      handleClickMask,
    ));
    const svg = (svgRef.current = d3
      .select(boardContainerRef.current)
      .append('svg')
      .style('width', '100%')
      .style('height', '100%')
      .attr('viewBox', [
        -boardWidth / 2,
        -boardHeight / 2,
        boardWidth,
        boardHeight,
      ])).on('click', boundMaskClick);

    /**
     * 根组合
     */
    const root = (rootRef.current = svg.append('g').attr('class', 'root'));
    const boundTransZoom = (boundTransZoomRef.current = onTransZoom(root));
    svg.call(boundTransZoom);

    /**
     * create simulation
     */
    const forceLinks = (forceLinksRef.current = d3
      .forceLink(links)
      .id((d: PathNode) => d.id)
      .distance((d) => {
        // link distance base on node radius
        const t1 = (d.source as PathNode).store.radius;
        const t2 = (d.target as PathNode).store.radius;
        return Math.max(t1, t2) * 2 + d.distance;
      })
      .strength((d) => d.force));
    const forceNodes = d3.forceManyBody().strength((d: PathNode) => {
      return d.store.relative === EntityType.Project ? -50 : -30;
    });
    const simulation: ForceSimulation = (simulationRef.current = d3
      .forceSimulation(nodes)
      .force('link', forceLinks)
      .force('center', d3.forceCenter(0, 0))
      .force('charge', forceNodes));

    /**
     * links
     */
    const linksSelection = (linksRef.current = root
      .append('g')
      .attr('class', 'links')
      .selectAll('g')
      .data(links)
      .join('g')
      .attr('class', (d) => d.store.id));

    // 关系图形
    linksSelection
      .filter((link) => !link.additional && !link.relative) // 主边
      .append('path')
      .attr('d', (d) => {
        const r1 = (d.source as PathNode).store.radius;
        const r2 = (d.target as PathNode).store.radius;
        return `M0 0
           V${r1}
           Q1 0,2 ${r2}
           V-${r2}
           Q1 0,0 ${-r1} Z`;
      })
      .attr('fill', (d) => `url(#${d.store.colorId})`);

    // 关系颜色
    const gradients = linksSelection
      .filter((link) => !link.additional)
      .append('linearGradient')
      .attr('id', (d) => d.store.colorId);
    gradients
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', LinkColor.Inactive)
      .attr('stop-opacity', LinkColorOpacity.Inactive)
      .style('transition', transition('all'));
    gradients
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', LinkColor.Inactive)
      .attr('stop-opacity', LinkColorOpacity.Inactive)
      .style('transition', transition('all'));

    linksSelection
      .filter((link) => link.additional) // 额外边
      .append('line')
      .attr('stroke', LinkColor.Hidden)
      .attr('stroke-dasharray', [10, 8])
      .attr('stroke-width', 4)
      .style('transition', transition('stroke'));

    /**
     * nodes
     */
    const boundEnterNode = (boundEnterNodeRef.current = onEnterNode(
      tickBindRefs,
      handleEnterNode,
    ));
    const boundLeaveNode = (boundLeaveNodeRef.current = onLeaveNode(
      tickBindRefs,
      handleLeaveNode,
    ));
    const boundClickNode = (boundClickNodeRef.current = onClickNode(
      tickBindRefs,
      handleClickNode,
    ));
    const boundDrag = (boundDragRef.current = onDrag(simulation));

    const nodesSelection = (nodesRef.current = root
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', (d) => `node-${d.data.id}`)
      .on('click', boundClickNode)
      .on('mouseenter', boundEnterNode)
      .on('mouseleave', boundLeaveNode)
      .on('mousedown', handleMouseDownNode)
      .on('mouseup', handleMouseUpNode)
      .call(boundDrag));

    // 节点背景
    nodesSelection
      .append('circle')
      .attr('r', (d) => d.store.radius)
      .attr('fill', (d) => d.store.color)
      .style('transition', transition('fill'));

    // 用户头像
    const userNodes = nodesSelection.filter(
      (d) => d.data.type === EntityType.User,
    );

    userNodes
      .append('image')
      .attr('width', (d) => d.store.imageWidth)
      .attr('height', (d) => d.store.imageWidth)
      // @ts-ignore
      .attr('xlink:href', (d) => d.data.avatar)
      // @ts-ignore
      .attr('src', (d) => d.data.avatar)
      .attr('transform', (d) => {
        const { radius: r, imagePadding: pad } = d.store;
        const offset = -r + pad;
        return `translate(${offset}, ${offset})`;
      })
      .attr('clip-path', (d) => `url(#node-${d.data.id}-circle)`);

    userNodes
      .append('circle')
      .attr('class', 'user-mask')
      .attr('r', (d) => d.store.radius)
      .attr('fill', 'black')
      .attr('opacity', NodeImageMaskOpacity.Inactive)
      .style('transition', transition('opacity'));

    // 节点文字
    const itemNodes = nodesSelection.filter(
      (d) => d.data.type !== EntityType.User,
    );

    itemNodes
      .select('circle')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', NodeStrokeWidth.Inactive);

    itemNodes
      .append('text')
      .text((d) => d.store.text)
      .attr('fill', NodeTextColor.Inactive)
      .style('user-select', 'none')
      .style('dominant-baseline', 'middle')
      .style('text-anchor', 'middle')
      .style('font-size', (d) => `${d.store.fontSize}px`)
      .style('transition', transition('fill'));

    // bind simulation tick
    const boundOnTick = onTick({
      linksRef,
      nodesRef,
    });
    simulation.on('tick', boundOnTick).on('end', onEnd(simulation));
    simulation.alphaTarget(0.1).velocityDecay(0.1);

    setTimeout(() => {
      resetZoom();
    }, 750);
    setTimeout(() => {
      simulation.alphaTarget(0);
      simulation.velocityDecay(0.25);
    }, 3000);
  }, [source]);

  return <PathBoardContainer ref={boardContainerRef} />;
});

export default PathBoard;
