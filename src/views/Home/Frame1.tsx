import { CrafteamRoute } from '@views/Layout/type';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { HomePageFrame } from './styles';

import logoSrc from '../../assets/img/home_logo_small.png';

const FrameWrapper = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 40px;
  width: 100%;

  text-align: center;

  .title {
    font-size: 36px;
    font-weight: 600;
    color: #fff;
  }

  .subtitle {
    max-width: 50%;
    min-width: 650px;
    margin-top: 20px;
    margin-bottom: 40px;

    font-size: 16px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.8);
  }
`;

const FrameBg = styled.img`
  position: absolute;
  top: -150%;
  left: 60%;

  width: 2400px;
  z-index: -1;

  transform: translate(-50%, 0);
`;

const EntryBtn = styled(Link)`
  width: 240px;
  padding: 15px 0;
  border: 0;
  border-radius: 15px;

  font-size: 16px;
  font-weight: 600;
  text-decoration: none;

  color: #000;
  background-color: #fff;
  cursor: pointer;

  transition: box-shadow var(--trans_speed_level1);

  &:hover {
    box-shadow: 0 0px 5px inset rgba(0, 0, 0, 0.64);
  }
`;

const Frame1 = () => {
  const title = 'Stimulate Endividual Energy for your Remote Team';
  const subtitle =
    'Using Crafteam, Easy to Communicate and collaborate with your online team at any time, more flexible in setting personal or organizational goals and tasks';

  return (
    <HomePageFrame>
      <FrameBg src={logoSrc} />
      <FrameWrapper className="frame1">
        <span className="title">{title}</span>
        <span className="subtitle">{subtitle}</span>
        <EntryBtn to={CrafteamRoute.Main}>Try for Free</EntryBtn>
      </FrameWrapper>
    </HomePageFrame>
  );
};

export default Frame1;
