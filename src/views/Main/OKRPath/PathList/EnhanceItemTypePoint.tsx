import React, { FC, MouseEventHandler } from 'react';
import styled from 'styled-components';

import { EntityType } from '@views/Main/state/okrDB/type';
import ItemTypePoint from '../ItemTooltip/ItemTypePoint';
import { typePointExpandColorMap } from './styles';
import classNames from 'classnames';

export const EnhanceItemTypePointWrapper = styled.div<{ type: EntityType }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid transparent;
  transition: border-color var(--trans_speed_level2);

  /* // TODO change to active */
  &.lightOn {
    border: 3px solid
      ${({ type }) => typePointExpandColorMap[type] || 'transparent'};
  }
`;

interface EnhanceItemTypePointProps {
  type: EntityType;
  lightOn: boolean;
  onClick?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
}

const EnhanceItemTypePoint: FC<EnhanceItemTypePointProps> = ({
  type,
  lightOn,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <EnhanceItemTypePointWrapper
      className={classNames({ lightOn })}
      type={type}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ItemTypePoint type={type} size={8} />
    </EnhanceItemTypePointWrapper>
  );
};

export default EnhanceItemTypePoint;
