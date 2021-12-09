import React from 'react';

import { BoxIconType } from '@components/BoxIcon';
import { Container } from './styles';
import NavApp from './NavApp';

const FooterNav = () => {
  const figmaLink = 'https://www.figma.com/file/VDlm87TVWZtDKFQRYJ4fgg/Untitled?node-id=17%3A829';
  const storyLink = 'https://joezhao.notion.site/MVP-Story-211938a1ba3b4949a74c10dd6080a96d';

  return (
    <Container>
      <NavApp icon={BoxIconType.Calender} title={'Date'} outerLink={storyLink} />
      <NavApp icon={BoxIconType.File} title={'Doc'} outerLink={storyLink} />
      <NavApp icon={BoxIconType.Branch} title={'Path'} outerLink={storyLink} />
      <NavApp icon={BoxIconType.ListCheck} title={'Todo'} outerLink={storyLink} />
    </Container>
  );
};

export default FooterNav;
