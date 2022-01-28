import { EntityType } from '@views/Main/state/okrDB/type';
import React from 'react';
import styled from 'styled-components';

interface ItemTypePointProps {
  color: string;
  size?: number;
}

const ItemTypePoint = styled.i<ItemTypePointProps>`
  width: 12px;
  height: 12px;
  ${({ size }) =>
    size
      ? `width: ${size}px;
        height: ${size}px;`
      : ''}
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

export default ItemTypePoint;
