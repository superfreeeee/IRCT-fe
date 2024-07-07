import React, { FC, useMemo } from 'react';
import classNames from 'classnames';

import { wrapFn } from '@/utils';
import { HidePageWrapper } from './styles';

import hidePageUrl from '@/assets/img/hide_page.png';

interface HidePageProps {
  revert?: boolean;
  onClick?: () => void;
}

const HidePage: FC<HidePageProps> = ({ revert = false, onClick }) => {
  const wrappedCb = useMemo(() => wrapFn(onClick), [onClick]);
  return (
    <HidePageWrapper
      className={classNames({ revert })}
      onClick={wrappedCb}
      title="点击"
    >
      <img src={hidePageUrl} width={'100%'} />
    </HidePageWrapper>
  );
};

export default HidePage;
