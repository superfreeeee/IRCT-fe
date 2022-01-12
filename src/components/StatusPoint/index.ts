import styled from 'styled-components';

import { UserState } from './type';

const overrideSize = (size?: number) =>
  size
    ? `width: ${size}px;
       height: ${size}px;`
    : '';

const stateToColor = (state: UserState) => `var(--state_${state})`;

interface StatusPointProps {
  state: UserState;
  size?: number;
}

const StatusPoint = styled.span<StatusPointProps>`
  &::after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    ${({ size }) => overrideSize(size)}
    margin-left: 5px;
    border-radius: 50%;
    background-color: ${({ state }) => stateToColor(state)};
  }
`;

export default StatusPoint;
