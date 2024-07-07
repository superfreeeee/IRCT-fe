import {
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { noop } from '@/utils';
import useClosestRef from './useClosestRef';

// ========== 类型声明 ==========
export enum DragEventType {
  Down = 'down',
  Move = 'move',
  Up = 'up',
}

export interface DragPositionObject {
  type: DragEventType;
  // 起始位置
  x0: number;
  y0: number;
  // 当前位置
  x: number;
  y: number;
  // 位移
  dx: number;
  dy: number;
}

export interface UseDragPositionListener {
  (e: MouseEvent, posObj: DragPositionObject): void;
}

export interface UseDragPositionListenerObj {
  onMouseDown?: UseDragPositionListener;
  onMouseMove?: UseDragPositionListener;
  onMouseUp?: UseDragPositionListener;
}

export interface UseDragPositionRes {
  onMouseDown: MouseEventHandler<HTMLElement>;
}

const positionObjectCreator =
  (x0: number, y0: number) =>
  (type: DragEventType, x: number, y: number): DragPositionObject => {
    return {
      type,
      x0,
      y0,
      x,
      y,
      dx: x - x0,
      dy: y - y0,
    };
  };

/**
 * 使用拖拽位置
 * @param cb
 * @returns
 */
const useDragPosition = (
  cb: UseDragPositionListener | UseDragPositionListenerObj
): UseDragPositionRes => {
  const cbObj = useMemo(() => {
    if (typeof cb === 'function') {
      cb = {
        onMouseDown: cb,
        onMouseMove: cb,
        onMouseUp: cb,
      };
    }

    return cb;
  }, []);

  const cbRef = useClosestRef(cbObj);

  const removeMouseListenerRef = useRef(noop);
  const onMouseDown: UseDragPositionRes['onMouseDown'] = useCallback((e) => {
    e.preventDefault();
    const { clientX: x0, clientY: y0 } = e;

    const createPositionObject = positionObjectCreator(x0, y0);

    const onDown = cbRef.current.onMouseDown;
    onDown && onDown(e, createPositionObject(DragEventType.Down, x0, y0));

    const onMouseMove = (e) => {
      const onMove = cbRef.current.onMouseMove;
      if (onMove) {
        const { clientX: x, clientY: y } = e;
        onMove(e, createPositionObject(DragEventType.Move, x, y));
      }
    };

    const onMouseUp = (e) => {
      const onUp = cbRef.current.onMouseUp;
      if (onUp) {
        const { clientX: x, clientY: y } = e;
        onUp(e, createPositionObject(DragEventType.Up, x, y));
      }
      removeMouseListenerRef.current();
    };

    // listeners set & remove
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    removeMouseListenerRef.current = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      removeMouseListenerRef.current = noop;
    };
  }, []);

  // 组件卸载时取消监听函数
  useEffect(
    () => () => {
      removeMouseListenerRef.current();
    },
    []
  );

  return {
    onMouseDown,
  };
};

export default useDragPosition;
