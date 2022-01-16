import styled from 'styled-components';

import { UserState } from '@views/Main/state/user';

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
  }
`;

export default StatusPoint;
