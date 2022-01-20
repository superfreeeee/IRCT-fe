import React from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import { okrPathVisibleState } from '../state/okrPath';
import { OKRPathContainer } from './styles';
import SideActions from './SideActions';

// import

const OKRPath = () => {
  const visible = useRecoilValue(okrPathVisibleState);

  return (
    <OKRPathContainer className={classNames({ hide: !visible })}>
      <div>OKRPath</div>
      <SideActions />
    </OKRPathContainer>
  );
};

export default OKRPath;
