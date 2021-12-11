import React from 'react';

import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import { Divider } from '../styles';
import { RoomContainer, SimulationArea } from './styles';

const Room = () => {
  return (
    <RoomContainer>
      <p className="description">
        Desription:
        <br />
        Here is the design group 1 workstation, drag the head to communicate
        with the designer you want to find, please consciously control the
        distance and microphone sound
      </p>
      <Divider />
      <SimulationArea>
        <Avatar usage={AvatarUsage.RoomSpaceRoom} />
      </SimulationArea>
    </RoomContainer>
  );
};

export default Room;
