import React, { useRef } from 'react';

import Frame1 from './Frame1';
import FrameDescription from './FrameDescription';
import Header from './Header';
import RectPlaceholder from './RectPlaceholder';
import { HomeContainer, HomeFooter, HomePageFrame } from './styles';

const commonFramesData = [
  {
    title: 'Easy Communicate',
    subtitle:
      'Communication with out request, fell like working at real office',
  },
  {
    title: 'Auto Working Status',
    subtitle:
      'Change working status Automatically, Balance focus and communication',
    textRight: true,
  },
  {
    title: 'Easy Collaboration',
    subtitle:
      "Knowing what software they're using, easy to join and collaboration",
  },
  {
    title: 'Dynamic Objective',
    subtitle: `Visual Objective management tools
      Merging OKR, Project management, Task tool
      every one can redesign their job
      information are no longer barriers to innovation.`,
    textRight: true,
  },
];

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onClickOption = () => {
    console.log(`back to top`);
    containerRef.current && (containerRef.current.scrollTop = 0);
  };

  return (
    <HomeContainer ref={containerRef}>
      <Header onClickOption={onClickOption} />
      <Frame1 titles={commonFramesData.map(({ title }) => title)} />
      {commonFramesData.map(({ title, subtitle, textRight }) => (
        <HomePageFrame key={title}>
          <div className="common">
            <FrameDescription
              title={title}
              subtitle={subtitle}
              textRight={textRight}
            />
            <RectPlaceholder />
          </div>
        </HomePageFrame>
      ))}
      <HomeFooter>
        <div className="content">
          We Hope all people on the remote team can be fully respected and
          inspired
        </div>
        <div className="bottom-padding"></div>
      </HomeFooter>
    </HomeContainer>
  );
};

export default Home;
