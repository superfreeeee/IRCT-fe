import styled from 'styled-components';

import { UserState } from '@views/Main/state/type';

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
  position: relative;

  &::after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    ${({ size }) => overrideSize(size)}
    border-radius: 50%;
    background-color: ${({ state }) => stateToColor(state)};
    transition: background-color 0.1s;
  }
`;

export default StatusPoint;
