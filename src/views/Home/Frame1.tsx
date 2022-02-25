import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { CrafteamRoute } from '@views/Layout/type';
import RectPlaceholder from './RectPlaceholder';
import { HomePageFrame } from './styles';

import logoSrcBg1 from '../../assets/img/home_logo_bg1.png';

const PageFrameWithBg = styled(HomePageFrame)`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  background: url(${logoSrcBg1});
  background-size: cover;
  background-position: 0 -350px;
  background-repeat: no-repeat;
`;

const FrameWrapper = styled.p`
  min-height: 70vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
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
  /* mix-blend-mode: exclusion; */

  &:hover {
    box-shadow: 0 0px 5px inset rgba(0, 0, 0, 0.64);
  }
`;

interface Frame1Props {
  titles: string[];
}

const Frame1: FC<Frame1Props> = ({ titles }) => {
  const title = 'Stimulate Endividual Energy for your Remote Team';
  const subtitle =
    'Using Crafteam, Easy to Communicate and collaborate with your online team at any time, more flexible in setting personal or organizational goals and tasks';

  return (
    <PageFrameWithBg>
      <FrameWrapper className="frame1">
        <span className="title">{title}</span>
        <span className="subtitle">{subtitle}</span>
        <EntryBtn to={CrafteamRoute.Main}>Try for Free</EntryBtn>
      </FrameWrapper>
      <HomePageFrame>
        <div className="common" style={{ gap: 70 }}>
          <RectPlaceholder video />
          <ul style={{ margin: 'auto', fontSize: 24, fontWeight: 600 }}>
            {titles.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ul>
        </div>
      </HomePageFrame>
    </PageFrameWithBg>
  );
};

export default Frame1;
