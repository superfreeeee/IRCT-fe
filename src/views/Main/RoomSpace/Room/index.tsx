import React, {
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useRecoilValue } from 'recoil';

import { roundBy } from '@utils';
import { RoomType } from '@views/Main/state/type';
import { selectedRoomTypeState } from '@views/Main/state/im';
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
import MeetingRoomMembers from './MeetingRoomMembers';

const useAreaResizer = (): [number, MouseEventHandler] => {
  const [h, setH] = useState(DEFAULT_SIMULATION_AREA_HEIGHT);

  const prevHeightRef = useRef(0);
  const pressedPositionRef = useRef(0);

  const calcH = useCallback((e: MouseEvent) => {
    const currentY = e.clientY;
    const prevY = pressedPositionRef.current;

    const newH = roundBy(
      prevHeightRef.current + (currentY - prevY),
      MIN_SIMULATION_AREA_HEIGHT,
      MAX_SIMULATION_AREA_HEIGHT,
    );

    setH(newH);
    return newH;
  }, []);

  /**
   * mousedown 开始监听事件，修改 h 高度
   *   挂载 mousemove、mouseup 事件
   *   释放后取消监听
   */
  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      // update ref state
      prevHeightRef.current = h;
      pressedPositionRef.current = e.clientY;
      // start listening
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [h],
  );

  const onMouseMove = useCallback((e) => {
    calcH(e);
  }, []);

  const onMouseUp = useCallback((e) => {
    const newH = calcH(e);
    console.log(`[Room.useAreaResizer] newH = ${newH}`);
    // remove listening
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, []);

  return [h, onMouseDown];
};

const description = `A place to relax. If you want ☕️ coffee, please click the menu on the upper right to select coffee. It will be delivered to your office area in 30 minutes`;

const Room = () => {
  const areaWrapperRef = useRef<HTMLDivElement>(null);

  const currentRoomType = useRecoilValue(selectedRoomTypeState);
  const isMeeting =
    currentRoomType &&
    (currentRoomType === RoomType.Meeting ||
      currentRoomType === RoomType.TempMeeting);

  return (
    <RoomContainer>
      <RoomDescription>
        Desription:
        <br />
        {description}
      </RoomDescription>
      {/* Room 仿真空间 */}
      {isMeeting ? (
        <MeetingRoomMembers />
      ) : (
        <SimulationAreaWrapper ref={areaWrapperRef}>
          <SimulationArea areaWrapperRef={areaWrapperRef} />
        </SimulationAreaWrapper>
      )}
      {/* 拖拽调整仿真空间高度 */}
      {/* <Divider onMouseDown={onDividerMouseDown} style={{ paddingBottom: 12 }} /> */}
      {/* 文字聊天记录 */}
      <Chat isInRoom />
    </RoomContainer>
  );
};

export default Room;
