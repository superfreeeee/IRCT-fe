import classNames from 'classnames';
import React, { FC } from 'react';
import styled from 'styled-components';

const RectPlaceholderWrapper = styled.div`
  flex-shrink: 0;

  width: 500px;
  height: 350px;
  border-radius: 10px;

  background-color: #c4c4c4;

  &.video {
    width: 725px;
  }
`;

interface RectPlaceholderProps {
  video?: boolean;
}

const RectPlaceholder: FC<RectPlaceholderProps> = ({ video }) => {
  return <RectPlaceholderWrapper className={classNames({ video })} />;
};

export default RectPlaceholder;
