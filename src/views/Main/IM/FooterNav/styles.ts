import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 22px;
  width: 100%;
  background-color: var(--im_bg);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

export const NavAppContainer = styled.div`
  width: 25%;
  text-align: center;
  color: #fff;
  cursor: pointer;
`;
