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
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { EntityType, ViewPointType } from '@views/Main/state/okrDB/type';
import { PathBoardContainer } from './styles';
import {
  okrPathListVisibleState,
  tooltipDataState,
  tooltipPositionState,
  tooltipVisibleState,
  viewPointCenterUserIdState,
  viewPointStackUpdater,
  viewPointTypeState,
} from '@views/Main/state/okrPath';
import { ViewPointStackActionType } from '@views/Main/state/type';
import useClosestRef from '@hooks/useClosestRef';
import { deepCopy } from '@utils';
import {
  BoundNodeAction,
  LinkColor,
  LinkColorOpacity,
  LinksSelection,
  MaskSelection,
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
  const maskRef = useRef<MaskSelection>(null);
  const rootRef = useRef<RootSelection>(null);
  const linksRef = useRef<LinksSelection>(null);
  const nodesRef = useRef<NodesSelection>(null);

  // bounding
  const boundTransZoomRef = useRef<TransZoomBehavior>(null);
  const boundEnterNodeRef = useRef<BoundNodeAction>(null);
  const boundLeaveNodeRef = useRef<BoundNodeAction>(null);
  const boundClickNodeRef = useRef<BoundNodeAction>(null);

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

    maskRef.current
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
  const handleClickNode = useCallback((node: PathNode) => {
    const currentId = node.id;
    const lastId = lastClickItemIdRef.current;

    console.log(
      `[PathBoard] onClickNode(${currentId}), doubleClick: ${
        lastId === currentId
      }`,
      node,
    );
    const isCurrentOrg =
      viewPointTypeRef.current === ViewPointType.Organization;

    /**
     * 单击节点
     */
    // 1. 个人视图 => 展开 List 页面
    if (!isCurrentOrg) {
      setOkrPathListVisible(true);
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
    }
  }, []);
  const clearLastClickItemId = useCallback(() => {
    lastClickItemIdRef.current = '';
  }, []);
  // 更新视图的时候重置
  useEffect(clearLastClickItemId, [source]);

  /**
   * hover 时 tooltip
   */
  const setTooltipVisible = useSetRecoilState(tooltipVisibleState);
  const setTooltipPosition = useSetRecoilState(tooltipPositionState);
  const setTooltipData = useSetRecoilState(tooltipDataState);
  const handleEnterNode = useCallback((node: PathNode) => {
    const nodeEl = nodesRef.current
      .filter((d) => d === node)
      .node() as SVGGElement;

    const { x: dx, height } = containerRef.current.getBoundingClientRect();
    const { x, width, top } = nodeEl.getBoundingClientRect();

    setTooltipVisible(true);
    setTooltipPosition({
      left: x - dx + width / 2,
      bottom: height - top + 10,
    });
    setTooltipData(deepCopy(node));
  }, []);
  const handleLeaveNode = useCallback((node: PathNode) => {
    setTooltipVisible(false);
  }, []);
  // also clear when source change
  useEffect(() => {
    setTooltipVisible(false);
  }, [source]);

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
   */
  // useEffect(() => {}, []);

  /**
   * 数据变动时重新渲染
   */
  useEffect(() => {
    console.group(`[PathBoard] source change`);
    console.log(`source(isDefault = ${source === DEFAULT_SOURCE})`, source);
    console.groupEnd();
    if (source === DEFAULT_SOURCE) {
      return;
    }

    const { nodes, links } = source;

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
    const svg = (svgRef.current = d3
      .select(boardContainerRef.current)
      .append('svg')
      .attr('width', boardWidth)
      .attr('height', boardHeight)
      .attr('viewBox', [
        -boardWidth / 2,
        -boardHeight / 2,
        boardWidth,
        boardHeight,
      ]));

    // const defs = svg.append('defs');

    /**
     * TranslateMask
     * 平移遮罩
     */
    const boundMaskClick = onMaskClick(tickBindRefs, clearLastClickItemId);
    const mask = (maskRef.current = svg
      .append('rect')
      .attr('class', 'mask')
      .style('fill', 'transparent') // 透明色
      .attr('x', -boardWidth / 2)
      .attr('y', -boardHeight / 2)
      .attr('width', width)
      .attr('height', height)
      .on('click', boundMaskClick));

    /**
     * 根组合
     */
    const root = (rootRef.current = svg.append('g').attr('class', 'root'));
    const boundTransZoom = (boundTransZoomRef.current = onTransZoom(root));
    mask.call(boundTransZoom);

    /**
     * create simulation
     */
    const forceLinks = d3
      .forceLink(links)
      .id((d: PathNode) => d.id)
      .distance((d) => {
        // link distance base on node radius
        const t1 = (d.source as PathNode).store.radius;
        const t2 = (d.target as PathNode).store.radius;
        return Math.max(t1, t2) * 2 + 30;
      })
      .strength((d) => d.force);
    const forceNodes = d3.forceManyBody().strength(-30);
    const simulation = d3
      .forceSimulation(nodes)
      .force('link', forceLinks)
      .force('center', d3.forceCenter(0, 0))
      .force('charge', forceNodes);

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
      .filter((link) => !link.additional) // 主边
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
    const boundDrag = onDrag(simulation);

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
    simulation.velocityDecay(0.1);

    // set center user center after 500ms
    setTimeout(() => {
      resetZoom();
      simulation.velocityDecay(0.25);
    }, 750);
  }, [source]);

  return <PathBoardContainer ref={boardContainerRef} />;
});

export default PathBoard;
