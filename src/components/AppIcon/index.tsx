import React, { FC } from 'react';
import styled from 'styled-components';
import { AppType, APP_ICON_URL_MAPPER } from './type';

const AppIconWrapper = styled.div<{ size: number }>`
  position: absolute;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`;

interface AppIconProps {
  type: AppType;
  size?: number;
}

const AppIcon: FC<AppIconProps> = ({ type, size = 16 }) => {
  return (
    <AppIconWrapper size={size}>
      <img src={APP_ICON_URL_MAPPER[type]} width={'100%'} />
    </AppIconWrapper>
  );
};

export default AppIcon;
