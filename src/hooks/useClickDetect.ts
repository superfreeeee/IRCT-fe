import React, { useEffect } from 'react';
import useClosestRef from './useClosestRef';

interface ClickDetectListener {
  (isOutside: boolean, e: MouseEvent): void;
}

const useClickDetect = (
  targetRef: React.RefObject<HTMLElement>,
  cb: ClickDetectListener,
  active: boolean = false,
) => {
  const cbLive = useClosestRef(cb);

  useEffect(() => {
    if (active) {
      const onDocumentClick = (e: MouseEvent) => {
        let isOuteSide = true;
        let el = e.target as Node;
        while (el && el !== document.body) {
          if (el === targetRef.current) {
            isOuteSide = false;
            break;
          }
          el = el.parentNode;
        }

        cbLive.current(isOuteSide, e);
      };

      document.addEventListener('mousedown', onDocumentClick, true); // mousedown 避免拖拽
      return () => {
        document.removeEventListener('mousedown', onDocumentClick, true);
      };
    }
  }, [active]);
};

export default useClickDetect;
