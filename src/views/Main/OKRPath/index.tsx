import React, { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import { okrPathVisibleState } from '../state/okrPath';
import { OKRPathContainer } from './styles';
import SideActions from './SideActions';
import PathBoard, { PathBoardRef } from './PathBoard';

// import

const OKRPath = () => {
  const visible = useRecoilValue(okrPathVisibleState);

  const boardRef = useRef<PathBoardRef>(null);

  return (
    <OKRPathContainer className={classNames({ hide: !visible })}>
      {/* 主板 */}
      <PathBoard ref={boardRef} />
      {/* Icon Btns */}
      <SideActions boardRef={boardRef} />
    </OKRPathContainer>
  );
};

export default OKRPath;
