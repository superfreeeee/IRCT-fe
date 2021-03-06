import styled from 'styled-components';

interface IProps {
  clickable: boolean;
}

export const I = styled.i<IProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  /* cursor: ${({ clickable }) => (clickable ? 'pointer' : 'inherit')}; */
`;
