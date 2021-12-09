import styled from 'styled-components';

export enum UserState {
  Idle = 'idle',
  Work = 'work',
  Busy = 'busy',
}

const stateToColor = (state: UserState) => `var(--state_${state})`;

interface StatusPointProps {
  state: UserState;
}

const StatusPoint = styled.div<StatusPointProps>`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ state }) => stateToColor(state)};
`;

export default StatusPoint;
