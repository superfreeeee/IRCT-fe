import classNames from 'classnames';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { okrListVisibleState } from '../state/okrPath';
import { OKRListContainer } from './styles';

const OKRList = () => {
  const visible = useRecoilValue(okrListVisibleState);

  return (
    <OKRListContainer className={classNames({ hide: !visible })}>
      <div>OKRList</div>
    </OKRListContainer>
  );
};

export default OKRList;
