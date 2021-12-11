import React, {
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';

import { Divider } from '../styles';
import Chat from '../Chat';
import SimulationArea from '../SimulationArea';
import {
  DEFAULT_SIMULATION_AREA_HEIGHT,
  MAX_SIMULATION_AREA_HEIGHT,
  MIN_SIMULATION_AREA_HEIGHT,
  RoomContainer,
  RoomDescription,
  SimulationAreaWrapper,
} from './styles';

const useAreaResizer = (): [number, MouseEventHandler] => {
  const [h, setH] = useState(DEFAULT_SIMULATION_AREA_HEIGHT);

  const prevHeightRef = useRef(0);
  const pressedPositionRef = useRef(0);

  const calcH = useCallback((e: MouseEvent) => {
    const currentY = e.clientY;
    const prevY = pressedPositionRef.current;

    const newH = Math.max(
      MIN_SIMULATION_AREA_HEIGHT,
      Math.min(
        MAX_SIMULATION_AREA_HEIGHT,
        prevHeightRef.current + (currentY - prevY)
      )
    );

    setH(newH);
    console.log(`calcH = ${newH}`);
  }, []);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      // console.log(e);
      // update ref state
      prevHeightRef.current = h;
      pressedPositionRef.current = e.clientY;
      // start listening
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [h]
  );

  const onMouseMove = useCallback((e) => {
    // console.log(e);
    calcH(e);
  }, []);

  const onMouseUp = useCallback((e) => {
    calcH(e);
    // console.log(e);
    // update ref state
    // remove listening
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, []);

  return [h, onMouseDown];
};

const Room = () => {
  const [areaH, onMouseDown] = useAreaResizer();

  return (
    <RoomContainer>
      <RoomDescription>
        Desription:
        <br />
        Here is the design group 1 workstation, drag the head to communicate
        with the designer you want to find, please consciously control the
        distance and microphone sound
      </RoomDescription>
      <Divider />
      {/* Room 仿真空间 */}
      <SimulationAreaWrapper style={{ height: areaH }}>
        <SimulationArea />
      </SimulationAreaWrapper>
      {/* 拖拽调整仿真空间高度 */}
      <Divider
        onMouseDown={onMouseDown}
        style={{ cursor: 'ns-resize', paddingBottom: 12 }}
      />
      {/* 文字聊天记录 */}
      <Chat isInRoom />
    </RoomContainer>
  );
};

export default Room;
