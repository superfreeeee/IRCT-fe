import React, { FC } from 'react';
import styled from 'styled-components';

import logoSrc from '../../assets/img/home_logo_small.png';

const HomeHeaderContainer = styled.div`
  position: sticky;
  top: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 40px 55px 20px 90px;

  background-color: rgba(255, 255, 255, 0.95);

  z-index: 10;

  .header-logo {
    cursor: pointer;
  }

  .header-logo,
  .header-options {
    display: flex;
    align-items: center;
    gap: 24px;

    font-size: 16px;
  }

  .divider {
    width: 1px;
    height: 16px;
    margin-left: 5px;
    border-radius: 1px;

    background-color: #333;
  }
`;

const HomeHeaderOption = styled.a`
  color: #000;

  text-decoration: none;
  cursor: pointer;

  &.wrapped {
    display: block;

    padding: 10px 25px;
    border-radius: 3px;

    color: #fff;
    background-color: #333;
  }
`;

interface HeaderProps {
  onClickOption: () => void;
}

const Header: FC<HeaderProps> = ({ onClickOption }) => {
  return (
    <HomeHeaderContainer>
      <div className="header-logo" onClick={onClickOption}>
        <img src={logoSrc} height={48} />
        <span>Crafteam</span>
      </div>
      <div className="header-options">
        <HomeHeaderOption onClick={onClickOption}>Product</HomeHeaderOption>
        <HomeHeaderOption onClick={onClickOption}>Download</HomeHeaderOption>
        <HomeHeaderOption onClick={onClickOption}>About Us</HomeHeaderOption>
        <div className="divider" />
        <HomeHeaderOption onClick={onClickOption}>Log in</HomeHeaderOption>
        <HomeHeaderOption className="wrapped" onClick={onClickOption}>
          Sign Up
        </HomeHeaderOption>
      </div>
    </HomeHeaderContainer>
  );
};

export default Header;
