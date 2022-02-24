import classNames from 'classnames';
import React, { FC, Fragment, useMemo } from 'react';
import styled from 'styled-components';

const FrameDescriptionContainer = styled.div`
  margin-left: 50px;
  
  color: #333;
  
  &.textRight {
    margin-left: 0;
    margin-right: 50px;
    
    text-align: right;
    order: 1;
  }
  
  .title {
    margin-bottom: 6px;
    
    font-size: 32px;
    font-weight: 600;
  }

  .subtitle {
    font-size: 18px;
  }
`;

interface FrameDescriptionProps {
  title: string;
  subtitle: string;
  textRight?: boolean;
}

const FrameDescription: FC<FrameDescriptionProps> = ({
  title,
  subtitle,
  textRight = false,
}) => {
  const subtitleContent = useMemo(() => {
    if (subtitle.includes('\n')) {
      const rows = subtitle.split('\n').map((str) => str.trim());
      return rows.map((row, i) => (
        <Fragment key={i}>
          <span>{row}</span>
          <br />
        </Fragment>
      ));
    } else {
      return subtitle;
    }
  }, [subtitle]);

  return (
    <FrameDescriptionContainer className={classNames({ textRight })}>
      <div className="title">{title}</div>
      <div className="subtitle">{subtitleContent}</div>
    </FrameDescriptionContainer>
  );
};

export default FrameDescription;
