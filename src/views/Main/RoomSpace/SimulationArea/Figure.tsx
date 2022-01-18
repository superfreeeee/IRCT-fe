import React, { FC, RefObject, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import classNames from 'classnames';

import {
  userRoomSpacePositionFamily,
  userVideoVoiceSwitchFamily,
} from '@views/Main/state/user';
import { RoomSpacePosition, UserRoomSpaceFigure } from '@views/Main/state/type';
import Avatar from '@components/Avatar';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import StatusPoint from '@components/StatusPoint';
import { roundBy } from '@utils';
import { stopPropagationHandler } from '@utils/dom';
import useClosestRef from '@hooks/useClosestRef';
import useDragPosition, { DragEventType } from '@hooks/useDragPosition';
import {
  FigureContainer,
  MicroOffWrapper,
  SIMULATION_BOARD_PADDING,
} from './styles';
import useShadowState from '@hooks/useShadowState';

const MicroOff = () => {
  return (
    <MicroOffWrapper>
      <BoxIcon type={BoxIconType.MicrophoneOff} />
    </MicroOffWrapper>
  );
};

interface FigureProps {
  figure: UserRoomSpaceFigure;
  boardRef: RefObject<HTMLDivElement>;
  onFigureMove: (userId: string, position: RoomSpacePosition) => void;
}

const Figure: FC<FigureProps> = ({ figure, boardRef, onFigureMove }) => {
  const [position, setPosition] = useShadowState(figure.position);

  const positionRef = useClosestRef(position);

  const setUserRoomSpacePosition = useSetRecoilState(
    userRoomSpacePositionFamily(figure.id),
  );
  const lastPositionRef = useRef<RoomSpacePosition>(null);
  const boardRectRef = useRef<DOMRect>(null); // 记忆背景板 DOMRect 对象
  const { onMouseDown } = useDragPosition((e, { type, dx, dy }) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === DragEventType.Down) {
      // MouseDown 时记录起始位置 & 初始 boardRect 状态
      lastPositionRef.current = [...positionRef.current];
      boardRectRef.current = boardRef.current.getBoundingClientRect();
    } else {
      // MouseMove 时更新局部 position
      const { width, height } = boardRectRef.current;
      const [x, y] = lastPositionRef.current;

      const x1 = roundBy(
        x + dx,
        SIMULATION_BOARD_PADDING,
        width - SIMULATION_BOARD_PADDING,
      );
      const y1 = roundBy(
        y + dy,
        SIMULATION_BOARD_PADDING,
        height - SIMULATION_BOARD_PADDING,
      );
      const newPosition: RoomSpacePosition = [x1, y1];
      setPosition(newPosition);

      // MouseUp 时同步全局状态
      if (type === DragEventType.Up && (x !== x1 || y !== y1)) {
        // 更新当前用户 position
        setUserRoomSpacePosition(newPosition);
        // 更新其他用户 talking
        onFigureMove(figure.id, newPosition);
      }
    }
  });

  const isTalking = figure.isTalking;
  const isMute = !useRecoilValue(userVideoVoiceSwitchFamily(figure.id));
  const activeButMute = isTalking && isMute;

  return (
    <FigureContainer
      className={classNames({ inactive: !isTalking, mute: activeButMute })}
      title="点击+拖拽"
      onClick={stopPropagationHandler}
      onMouseDown={onMouseDown}
      style={{ left: position[0], top: position[1] }}
    >
      <Avatar>
        <img src={figure.avatar} width={'100%'} />
      </Avatar>
      <StatusPoint state={figure.state} />
      {isMute && <MicroOff />}
    </FigureContainer>
  );
};

export default Figure;
