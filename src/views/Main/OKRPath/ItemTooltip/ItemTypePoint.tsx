import styled from 'styled-components';

import { EntityType } from '@/views/Main/state/okrDB/type';
import { NodeColor } from '../PathBoard/type';

const entityColorMap: { [type in EntityType]: NodeColor } = {
  [EntityType.User]: NodeColor.User,
  [EntityType.O]: NodeColor.ActiveO,
  [EntityType.KR]: NodeColor.ActiveKR,
  [EntityType.Project]: NodeColor.ActiveProject,
  [EntityType.Todo]: NodeColor.ActiveTodo,
};

const bgColor = ({ color, type }: ItemTypePointProps) =>
  type !== undefined ? entityColorMap[type] : color;

interface ItemTypePointProps {
  color?: string;
  type?: EntityType;
  size?: number;
}

const ItemTypePoint = styled.i<ItemTypePointProps>`
  display: inline-block;
  width: 12px;
  height: 12px;
  ${({ size }) =>
    size
      ? `width: ${size}px;
        height: ${size}px;`
      : ''}
  border-radius: 50%;
  background-color: ${bgColor};
`;

export default ItemTypePoint;
