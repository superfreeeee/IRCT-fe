import styled from 'styled-components';

export const FooterNavContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 -5px 5px rgba(0, 0, 0, 0.16);
  background-color: var(--container_bg);
`;

export const NavAppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 45px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
`;
