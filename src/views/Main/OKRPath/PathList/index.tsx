import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import { okrPathListVisibleState } from '../../state/okrPath';
import { OKRListContainer } from './styles';

const PathList = () => {
  const visible = useRecoilValue(okrPathListVisibleState);

  const setVisible = useSetRecoilState(okrPathListVisibleState);

  return (
    <OKRListContainer className={classNames({ hide: !visible })}>
      <div>OKRList</div>
      <button onClick={() => setVisible(false)}>Close</button>
    </OKRListContainer>
  );
};

export default PathList;
