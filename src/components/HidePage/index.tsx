import React, { FC, useMemo } from 'react';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { HidePageWrapper } from './styles';
import { wrapFn } from '@utils';

interface AbsolutePosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface HidePageProps {
  position?: AbsolutePosition;
  revert?: boolean;
  onClick?: () => void;
}

const HidePage: FC<HidePageProps> = ({ position, revert = false, onClick }) => {
  const wrappedCb = useMemo(() => wrapFn(onClick), [onClick]);
  return (
    <HidePageWrapper style={{ ...position }} onClick={wrappedCb}>
      <BoxIcon
        type={revert ? BoxIconType.NextPage : BoxIconType.LastPage}
        size={'sm'}
      />
    </HidePageWrapper>
  );
};

export default HidePage;
