import React from 'react';

import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';

const SimulationArea = () => {
  return (
    <div>
      <Avatar usage={AvatarUsage.RoomSpaceRoom} />
    </div>
  );
};

export default SimulationArea;
