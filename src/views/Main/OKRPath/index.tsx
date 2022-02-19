import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import { listToMapper } from '@utils';
import {
  okrPathVisibleState,
  viewPointCenterUserIdState,
  viewPointTypeState,
} from '../state/okrPath';
import {
  getOrganizationViewPoint,
  getPersonalViewPoint,
} from '../state/okrDB/api';
import { ViewPointSource, ViewPointType } from '../state/okrDB/type';
import { PathBoardSource, PathLink, PathNode } from './PathBoard/type';
import { bindInitItems, entityToNode, relationToLink } from './PathBoard/utils';
import ItemTooltip from './ItemTooltip';
import CustomContextMenu from './CustomContextMenu';
import EditEntityModal from './EditEntityModal';
import SideActions from './SideActions';
import PathBoard, { PathBoardRef } from './PathBoard';
import PathList, { PathListRef } from './PathList';
import { PathListSource } from './type';
import { OKRPathContainer } from './styles';

const OKRPath = () => {
  const visible = useRecoilValue(okrPathVisibleState);

  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<PathBoardRef>(null);
  const listRef = useRef<PathListRef>(null);

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
    const nodes: PathNode[] = entities.map(entityToNode);
    const links: PathLink[] = relations.map(relationToLink);

    /**
     * 2. 计算固定状态
     *    calc store init
     */
    const _nodeMap = listToMapper(nodes, (node) => node.id);
    bindInitItems(viewPointType)(nodes, links, _nodeMap);

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
      <PathBoard
        ref={boardRef}
        containerRef={containerRef}
        source={source}
        listRef={listRef}
      />
      {/* 右侧列表 */}
      <PathList ref={listRef} inheritTree={inheritTree} boardRef={boardRef} />
      {/* Icon Btns */}
      <SideActions boardRef={boardRef} listRef={listRef} />
      {/* Node hover tooltip */}
      <ItemTooltip />
      {/* 右键列表 */}
      <CustomContextMenu listRef={listRef} />
      {/* 新增、添加、删除 Modal */}
      <EditEntityModal />
    </OKRPathContainer>
  );
};

export default OKRPath;
