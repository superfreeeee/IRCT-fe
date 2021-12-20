import React, {
  FC,
  MouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import {
  SpaceFigure,
  SpaceFigurePosition,
  updateFigurePositionAction,
} from '@store/reducers/space';
import { noop, roundBy } from '@utils';
import { FigureContainer, SIMULATION_BOARD_PADDING } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AppState } from '@store/reducers';

interface FigureProps {
  figure: SpaceFigure;
  boardRef: RefObject<HTMLDivElement>;
}

const Figure: FC<FigureProps> = ({ figure, boardRef }) => {
  const roomId = useSelector((state: AppState) => state.room.selected);

  const [position, setPosition] = useState(figure.position);
  const positionRef = useRef<SpaceFigurePosition>(null);
  positionRef.current = position;

  const lastPositionRef = useRef<SpaceFigurePosition>(null);

  const dispatch = useDispatch();

  const removeMouseListenerRef = useRef(noop);
  const onMouseDown = useCallback((e: MouseEvent) => {
    const { clientX: x0, clientY: y0 } = e;

    // TODO clear console
    // console.log(
    //   `[Figure] mouse down(${figure.userId}): (x0, y0) = (${x0}, ${y0})`
    // );

    const originPosition = (lastPositionRef.current = positionRef.current);

    const calcNewPosition = (x1: number, y1: number): SpaceFigurePosition => {
      const { width, height } = boardRef.current.getBoundingClientRect();
      const [dx, dy] = [x1 - x0, y1 - y0];
      const x = roundBy(
        originPosition[0] + dx,
        SIMULATION_BOARD_PADDING,
        width - SIMULATION_BOARD_PADDING
      );
      const y = roundBy(
        originPosition[1] + dy,
        SIMULATION_BOARD_PADDING,
        height - SIMULATION_BOARD_PADDING
      );
      return [x, y];
    };

    const onMouseMove = (e) => {
      const { clientX: x1, clientY: y1 } = e;
      // TODO clear console
      // console.log(
      //   `[Figure] mouse move(${
      //     figure.userId
      //   }): (x1, y1) = (${x1}, ${y1}), (dx, dy) = (${x1 - x0}, ${y1 - y0})`
      // );

      const tempPosition = calcNewPosition(x1, y1);
      setPosition(tempPosition);
    };

    const updateFigurePosition = bindActionCreators(
      updateFigurePositionAction,
      dispatch
    );

    const onMouseUp = (e) => {
      const { clientX: x1, clientY: y1 } = e;
      // TODO clear console
      // console.log(
      //   `[Figure] mouse up(${
      //     figure.userId
      //   }): (x1, y1) = (${x1}, ${y1}), (dx, dy) = (${x1 - x0}, ${y1 - y0})`
      // );

      const finalPosition = calcNewPosition(x1, y1);
      setPosition(finalPosition);

      removeMouseListenerRef.current();

      updateFigurePosition({
        roomId,
        userId: figure.userId,
        position: finalPosition,
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    removeMouseListenerRef.current = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      removeMouseListenerRef.current = noop;
    };
  }, []);

  useEffect(
    () => () => {
      removeMouseListenerRef.current();
    },
    []
  );

  return (
    <FigureContainer
      onMouseDown={onMouseDown}
      style={{ left: position[0], top: position[1] }}
    >
      <Avatar usage={AvatarUsage.RoomSpaceRoom}>
        {figure.userId.substring(figure.userId.indexOf('-') + 1)}
      </Avatar>
    </FigureContainer>
  );
};

export default Figure;
