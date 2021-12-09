import React, { FC } from 'react';

import { UnreadWrapper } from './styles';

interface UnreadPinProps {
  num: number;
}

const UnreadPin: FC<UnreadPinProps> = ({ num }) => {
  return <UnreadWrapper>{num}</UnreadWrapper>;
};

export default UnreadPin;
