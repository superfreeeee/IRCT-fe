import React, { FC, RefObject, useMemo, useRef, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@components/Avatar';
import {
  SpaceFigure,
  SpaceFigurePosition,
  updateFigurePositionAction,
} from '@store/reducers/space';
import { AppState } from '@store/reducers';
import { roundBy } from '@utils';
import { stopPropagationHandler } from '@utils/dom';
import useClosestRef from '@hooks/useClosestRef';
import useDragPosition, { DragEventType } from '@hooks/useDragPosition';
import {
  FigureContainer,
  MicroOffWrapper,
  SIMULATION_BOARD_PADDING,
} from './styles';
import classNames from 'classnames';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import StatusPoint from '@components/StatusPoint';

const MicroOff = () => {
  return (
    <MicroOffWrapper>
      <BoxIcon type={BoxIconType.MicrophoneOff} />
    </MicroOffWrapper>
  );
};

interface FigureProps {
  figure: SpaceFigure;
  boardRef: RefObject<HTMLDivElement>;
  onFigureMove: () => void;
}

const Figure: FC<FigureProps> = ({ figure, boardRef, onFigureMove }) => {
  const roomId = useSelector((state: AppState) => state.room.selected);

  const [position, setPosition] = useState(figure.position);
  const positionRef = useClosestRef(position);

  const dispatch = useDispatch();
  const lastPositionRef = useRef<SpaceFigurePosition>(null);
  const boardRectRef = useRef<DOMRect>(null); // 记忆背景板 DOMRect 对象
  const { onMouseDown } = useDragPosition((e, { type, dx, dy }) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === DragEventType.Down) {
      lastPositionRef.current = [...positionRef.current];
      boardRectRef.current = boardRef.current.getBoundingClientRect();
    } else {
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
      const newPosition: SpaceFigurePosition = [x1, y1];
      setPosition(newPosition);

      // 释放鼠标
      if (type === DragEventType.Up && (x !== x1 || y !== y1)) {
        const updateFigurePosition = bindActionCreators(
          updateFigurePositionAction,
          dispatch,
        );
        updateFigurePosition({
          roomId,
          userId: figure.userId,
          position: newPosition,
        });

        onFigureMove();
      }
    }
  });

  const { id: currentUserId, videoVoice } = useSelector(
    (state: AppState) => state.user,
  );

  const isSelf = figure.userId === currentUserId;

  const inactive = !figure.active;
  const isMute = isSelf ? !videoVoice : figure.mute;
  const activeButMute = figure.active && isMute;

  return (
    <FigureContainer
      className={classNames({ inactive, mute: activeButMute })}
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
