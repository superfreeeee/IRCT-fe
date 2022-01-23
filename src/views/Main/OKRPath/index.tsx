import React from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import { okrPathVisibleState } from '../state/okrPath';
import { OKRPathContainer } from './styles';
import SideActions from './SideActions';
import PathBoard from './PathBoard';

// import

const OKRPath = () => {
  const visible = useRecoilValue(okrPathVisibleState);

  return (
    <OKRPathContainer className={classNames({ hide: !visible })}>
      {/* 主板 */}
      <PathBoard />
      {/* Icon Btns */}
      <SideActions />
    </OKRPathContainer>
  );
};

export default OKRPath;
