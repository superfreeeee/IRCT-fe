import React, { useEffect, useImperativeHandle, useRef } from 'react';
import * as d3 from 'd3';

import { getOrganizationViewPoint } from '@views/Main/state/okrDB/api';
import { EntityType, ViewPointType } from '@views/Main/state/okrDB/type';
import { PathBoardContainer } from './styles';
import {
  LinkColor,
  LinksSelection,
  MaskSelection,
  NodesSelection,
  NodeTextColor,
  PathLink,
  PathNode,
  RootSelection,
  SVGSelection,
  TickBindRefs,
  TransZoomBehavior,
} from './type';
import {
  linkColor,
  nodeColor,
  nodeImageWidth,
  nodeRadius,
  nodeText,
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

const BOARD_ID = 'path-board';

export interface PathBoardRef {
  resetZoom: () => void;
}

const PathBoard = React.forwardRef((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // svg elements selections
  const svgRef = useRef<SVGSelection>(null);
  const maskRef = useRef<MaskSelection>(null);
  const rootRef = useRef<RootSelection>(null);
  const linksRef = useRef<LinksSelection>(null);
  const nodesRef = useRef<NodesSelection>(null);

  // bounding
  const boundTransZoomRef = useRef<TransZoomBehavior>(null);

  /**
   * 初始化数据
   */
  useEffect(() => {
    const orgVP = getOrganizationViewPoint();
    console.log(`orgVP`, orgVP);

    const { width, height } = containerRef.current.getBoundingClientRect();

    const boardWidth = width;
    const boardHeight = height;

    // data transform
    const nodes: PathNode[] = orgVP.entities.map((entity) => ({
      id: entity.id,
      data: entity,
      store: {},
      draggable: true,
      // draggable: entity.type !== EntityType.User,
    }));
    const links: PathLink[] = orgVP.relations.map((rel) => ({
      ...rel,
      store: {},
    }));

    // calc node side data(store in d.store)
    const _calcRadius = nodeRadius(ViewPointType.Organization);
    const _calcWidth = nodeImageWidth(ViewPointType.Organization);
    const _nodeMap = {}; // nodeId => node
    nodes.forEach((node) => {
      _calcRadius(node);
      _calcWidth(node);
      nodeColor(node);
      _nodeMap[node.id] = node;
    });
    // calc link side data(store in d.store)
    links.forEach((link) => {
      linkColor(link, _nodeMap);
      const linkId = (link.store.id = `link-${link.source}-${link.target}`);
      link.store.colorId = `${linkId}-color`;
    });

    console.table(nodes);
    console.table(links);

    // refs for function binding
    const tickBindRefs: TickBindRefs = {
      linksRef,
      nodesRef,
    };

    /**
     * svg Element
     */
    const svg = (svgRef.current = d3
      .select(`#${BOARD_ID}`)
      .append('svg')
      .attr('width', boardWidth)
      .attr('height', boardHeight)
      .attr('viewBox', [
        -boardWidth / 2,
        -boardHeight / 2,
        boardWidth,
        boardHeight,
      ]));

    const defs = svg.append('defs');

    /**
     * TranslateMask
     * 平移遮罩
     */
    const boundMaskClick = onMaskClick(tickBindRefs);
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
      .strength(0.1);
    const forceNodes = d3.forceManyBody().strength(-50);
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
      .append('linearGradient')
      .attr('id', (d) => d.store.colorId);
    gradients
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', LinkColor.Inactive)
      .attr('stop-opacity', 0.1)
      .style('transition', transition('all'));
    gradients
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', LinkColor.Inactive)
      .attr('stop-opacity', 0.1)
      .style('transition', transition('all'));

    /**
     * nodes
     */
    const boundEnterNode = onEnterNode(tickBindRefs);
    const boundLeaveNode = onLeaveNode(tickBindRefs);
    const boundClickNode = onClickNode(tickBindRefs);
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
      .attr('opacity', 0.5)
      .style('transition', transition('opacity'));

    // 节点文字
    const itemNodes = nodesSelection.filter(
      (d) => d.data.type !== EntityType.User,
    );

    itemNodes
      .select('circle')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 0);

    itemNodes
      .append('text')
      .text(nodeText)
      .attr('fill', NodeTextColor.Inactive)
      .style('user-select', 'none')
      .style('dominant-baseline', 'middle')
      .style('text-anchor', 'middle')
      .style('transition', transition('fill'));

    // bind simulation tick
    const boundOnTick = onTick({
      linksRef,
      nodesRef,
    });
    simulation.on('tick', boundOnTick).on('end', onEnd(simulation));
    simulation.velocityDecay(0.1);
  }, []);

  /**
   * 外部操作
   */
  useImperativeHandle(
    ref,
    () => {
      const resetZoom = () => {
        console.log(`[PathBoard] resetZoom`);
        maskRef.current
          .transition()
          .duration(750)
          .call(boundTransZoomRef.current.transform, d3.zoomIdentity.scale(1));
      };

      return {
        resetZoom,
      };
    },
    [],
  );

  return (
    <PathBoardContainer ref={containerRef}>
      <div id={BOARD_ID}></div>
    </PathBoardContainer>
  );
});

export default PathBoard;
