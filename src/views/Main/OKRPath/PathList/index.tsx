import React from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import { okrPathListVisibleState } from '../../state/okrPath';
import { OKRListContainer } from './styles';

const PathList = () => {
  const visible = useRecoilValue(okrPathListVisibleState);

  return (
    <OKRListContainer className={classNames({ hide: !visible })}>
      <div>OKRList</div>
    </OKRListContainer>
  );
};

export default PathList;
