import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import {
  okrPathVisibleState,
  viewPointCenterUserIdState,
  viewPointTypeState,
} from '../state/okrPath';
import { OKRPathContainer } from './styles';
import SideActions from './SideActions';
import PathBoard, { PathBoardRef } from './PathBoard';
import PathList from './PathList';
import {
  getOrganizationViewPoint,
  getPersonalViewPoint,
} from '../state/okrDB/api';
import {
  ViewPointEntity,
  ViewPointSource,
  ViewPointType,
} from '../state/okrDB/type';
import {
  NodeState,
  PathBoardSource,
  PathLink,
  PathNode,
} from './PathBoard/type';
import {
  linkColor,
  linkId,
  nodeColor,
  nodeImageWidth,
  nodeRadius,
  nodeStrokeWidth,
  nodeText,
} from './PathBoard/utils';
import ItemTooltip from './ItemTooltip';
import { PathListSource } from './type';

const OKRPath = () => {
  const visible = useRecoilValue(okrPathVisibleState);

  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<PathBoardRef>(null);

  const viewPointType = useRecoilValue(viewPointTypeState);
  const centerUserId = useRecoilValue(viewPointCenterUserIdState);

  // state for rendering
  const [source, setSource] = useState<PathBoardSource>(undefined);
  const [inheritTree, setInheritTree] = useState<PathListSource>(undefined);

  // 视图/中心用户改变时重新渲染
  useEffect(() => {
    let viewPointData: ViewPointSource;
    if (viewPointType === ViewPointType.Organization) {
      viewPointData = getOrganizationViewPoint();
    } else {
      viewPointData = getPersonalViewPoint(centerUserId);
    }

    const { entities, relations, inheritTree } = viewPointData;

    // TODO clear console
    console.group(`[OKRPath] view change`);
    console.log(`viewPointType = ${viewPointType}`);
    console.log(`centerUserId = ${centerUserId}`);
    console.log(`entities`, entities);
    console.log(`relations`, relations);
    console.log(`inheritTree`, inheritTree);
    console.groupEnd();

    /**
     * 1. 数据变换
     *    api => PathNode/PathLink
     */
    // data transform
    const nodes: PathNode[] = entities.map(
      (entity: ViewPointEntity): PathNode => ({
        id: entity.id,
        data: entity,
        store: {
          state: NodeState.Inactive,
        },
        draggable: true,
        // draggable: entity.type !== EntityType.User,
        seq: entity.seq,
      }),
    );
    const links: PathLink[] = relations.map((rel) => ({
      ...rel,
      store: {},
      additional: !!rel.additional,
      force: rel.force !== undefined ? rel.force : 1,
    }));

    /**
     * 2. 计算固定状态
     *    calc store init
     */
    // calc node side data(store in d.store)
    const _calcRadius = nodeRadius(viewPointType);
    const _calcWidth = nodeImageWidth(viewPointType);
    const _calcText = nodeText(viewPointType);
    const _nodeMap = {}; // nodeId => node
    nodes.forEach((node) => {
      _calcRadius(node);
      _calcWidth(node);
      _calcText(node);
      nodeColor(node);
      nodeStrokeWidth(node);
      // store nodeMap for linkColor
      _nodeMap[node.id] = node;
    });
    // calc link side data(store in d.store)
    links.forEach((link) => {
      linkColor(link, _nodeMap);
      linkId(link);
    });

    /**
     * 3. 更新 board source
     */
    setSource({ nodes, links });
    setInheritTree(inheritTree);
  }, [viewPointType, centerUserId]);

  return (
    <OKRPathContainer
      ref={containerRef}
      className={classNames({ hide: !visible })}
    >
      {/* 主板 */}
      <PathBoard ref={boardRef} containerRef={containerRef} source={source} />
      {/* 右侧列表 */}
      <PathList inheritTree={inheritTree} boardRef={boardRef} />
      {/* Icon Btns */}
      <SideActions boardRef={boardRef} />
      {/* Node hover tooltip */}
      <ItemTooltip />
    </OKRPathContainer>
  );
};

export default OKRPath;
