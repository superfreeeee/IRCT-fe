import React, { FC, MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import { EntityType } from '@views/Main/state/okrDB/type';
import { useShowExpandBtn } from '@views/Main/state/hooks';
import { ExpandBtnPosition } from '@views/Main/state/type';
import { PathBoardRef } from '../PathBoard';
import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import useShadowState from '@hooks/useShadowState';
import { okrPathListVisibleState } from '../../state/okrPath';
import { PathListSource } from '../type';
import {
  DetailList,
  OKRListContainer,
  OKRListContent,
  OKRListHeader,
} from './styles';
import CommentArea from './CommentArea';
import ItemDetail from './ItemDetail';
import ExpandBtn from './ExpandBtn';

interface PathListProps {
  inheritTree: PathListSource;
  boardRef: MutableRefObject<PathBoardRef>;
}

const PathList: FC<PathListProps> = ({ inheritTree, boardRef }) => {
  const [shadowTree, setShadowTree] = useShadowState(inheritTree);
  const visible = useRecoilValue(okrPathListVisibleState);

  const setVisible = useSetRecoilState(okrPathListVisibleState);

  // handle inherit change
  useEffect(() => {
    console.log(`[PathList] inheritTree change`, inheritTree);
  }, [inheritTree]);

  const hide = !visible || !inheritTree;

  // ========== header ==========
  const headerEl = useMemo(() => {
    if (!inheritTree) {
      return null;
    }

    const { node: userNode } = inheritTree;
    // check user node
    if (userNode.type !== EntityType.User) {
      console.error(`[PathList] invalid inheritTree: none user root node`);
      return null;
    }

    const { avatar, name } = userNode;
    return (
      <OKRListHeader>
        <Avatar>
          <img src={avatar} width={'100%'} />
        </Avatar>
        <div className="info">
          <span>{name}</span>
          <BoxIcon type={BoxIconType.Branch} size={'xs'} />
        </div>
      </OKRListHeader>
    );
  }, [inheritTree]);

  // ========== expand btn ==========
  const showExpandBtn = useShowExpandBtn();
  const detailListRef = useRef<HTMLDivElement>(null);
  const hoverExpandBtn = (
    { left, top }: ExpandBtnPosition,
    isExpand: boolean,
  ) => {
    const listEl = detailListRef.current;
    const { left: baseLeft, top: baseTop } = listEl.getBoundingClientRect();

    const position: ExpandBtnPosition = {
      left: left - baseLeft,
      top: top - baseTop + listEl.scrollTop,
    };

    showExpandBtn(position, isExpand);
  };

  return (
    <OKRListContainer className={classNames({ hide })}>
      {headerEl}
      <OKRListContent>
        <DetailList ref={detailListRef}>
          {shadowTree &&
            Object.values(shadowTree.children).map((oEntityNode) => (
              <ItemDetail
                key={oEntityNode.node.id}
                node={oEntityNode}
                hoverExpandBtn={hoverExpandBtn}
                boardRef={boardRef}
              />
            ))}
          {/* <button onClick={() => setVisible(false)}>Close</button> */}
          <ExpandBtn />
        </DetailList>
        <CommentArea />
      </OKRListContent>
    </OKRListContainer>
  );
};

export default PathList;
