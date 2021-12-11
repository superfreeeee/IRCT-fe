import React, { FC } from 'react';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { HidePageWrapper } from './styles';

interface AbsolutePosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface HidePageProps {
  position?: AbsolutePosition;
  revert?: boolean;
}

const HidePage: FC<HidePageProps> = ({ position, revert = false }) => {
  return (
    <HidePageWrapper style={{ ...position }}>
      <BoxIcon
        type={revert ? BoxIconType.NextPage : BoxIconType.LastPage}
        size={'sm'}
      />
    </HidePageWrapper>
  );
};

export default HidePage;
