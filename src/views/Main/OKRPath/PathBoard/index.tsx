import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { getOrganizationViewPoint } from '@views/Main/state/okrDB/api';
import { PathBoardContainer } from './styles';
import { PathLink, PathNode } from './type';
import { EntityType } from '@views/Main/state/okrDB/type';

const BOARD_ID = 'path-board';

const PathBoard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const orgVP = getOrganizationViewPoint();
    console.log(`orgVP`, orgVP);
    console.table(orgVP.entities);
    console.table(orgVP.relations);

    const { width, height } = containerRef.current.getBoundingClientRect();

    const boardWidth = width * 0.8;
    const boardHeight = height * 0.8;

    // data transform
    const nodes: PathNode[] = orgVP.entities.map((entity) => ({
      id: entity.id,
      data: entity,
    }));
    const links: PathLink[] = orgVP.relations.map(({ fromId, toId }) => ({
      source: fromId,
      target: toId,
    }));

    // svg & selections
    const svg = d3
      .select(`#${BOARD_ID}`)
      .append('svg')
      .attr('width', boardWidth)
      .attr('height', boardHeight)
      .attr('viewBox', [
        -boardWidth / 2,
        -boardHeight / 2,
        boardWidth,
        boardHeight,
      ])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    const linksSelection = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .style('stroke', '#aaa');

    // Initialize the nodes
    const nodesSelection = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      // .attr('r', (d) => {
        
      // })
      // .style('fill', d => {
      //   if (d.data.type ===)
      // });

    // event handler
    const ticked = () => {
      linksSelection
        .attr('x1', (d) => (d.source as PathNode).x)
        .attr('y1', (d) => (d.source as PathNode).y)
        .attr('x2', (d) => (d.target as PathNode).x)
        .attr('y2', (d) => (d.target as PathNode).y);

      nodesSelection.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    };

    const forceLinks = d3
      .forceLink(links)
      .id((d: PathNode) => d.id)
      .strength(0.3);
    const forceNodes = d3.forceManyBody().strength(-50);
    const simulation = d3
      .forceSimulation(nodes)
      .force('link', forceLinks)
      .force('center', d3.forceCenter(0, 0))
      .force('charge', forceNodes)
      // .force('collide', d3.forceCollide().radius(30).iterations(2))
      .on('tick', ticked)
      .on('end', ticked);

    // simulation.alphaTarget(0).restart();
    simulation.alpha(1);

    // d3.json(
    //   'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json',
    //   function (data) {
    //     // Initialize the links
    //     var link = svg
    //       .selectAll('line')
    //       .data(data.links)
    //       .enter()
    //       .append('line')
    //       .style('stroke', '#aaa');

    //     // Initialize the nodes
    //     var node = svg
    //       .selectAll('circle')
    //       .data(data.nodes)
    //       .enter()
    //       .append('circle')
    //       .attr('r', 20)
    //       .style('fill', '#69b3a2');

    //     // Let's list the force we wanna apply on the network
    //     var simulation = d3
    //       .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
    //       .force(
    //         'link',
    //         d3
    //           .forceLink() // This force provides links between nodes
    //           .id(function (d) {
    //             return d.id;
    //           }) // This provide  the id of a node
    //           .links(data.links), // and this the list of links
    //       )
    //       .force('charge', d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    //       .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
    //       .on('end', ticked);

    //     // This function is run at each iteration of the force algorithm, updating the nodes position.
    //     function ticked() {
    //       link
    //         .attr('x1', function (d) {
    //           return d.source.x;
    //         })
    //         .attr('y1', function (d) {
    //           return d.source.y;
    //         })
    //         .attr('x2', function (d) {
    //           return d.target.x;
    //         })
    //         .attr('y2', function (d) {
    //           return d.target.y;
    //         });

    //       node
    //         .attr('cx', function (d) {
    //           return d.x + 6;
    //         })
    //         .attr('cy', function (d) {
    //           return d.y - 6;
    //         });
    //     }
    //   },
    // );
  }, []);

  return (
    <PathBoardContainer ref={containerRef}>
      <div id={BOARD_ID}></div>
      {/* <span>PathBoard</span> */}
    </PathBoardContainer>
  );
};

export default PathBoard;
