import React, { useEffect } from 'react';
import useClosestRef from './useClosestRef';

interface ClickDetectListener {
  (isOutside: boolean): void;
}

const useClickDetect = (
  targetRef: React.RefObject<HTMLElement>,
  cb: ClickDetectListener,
  active: boolean = false,
) => {
  const cbLive = useClosestRef(cb);

  useEffect(() => {
    if (active) {
      const onDocumentClick = (e) => {
        let isOuteSide = true;
        let el = e.target as Node;
        while (el && el !== document.body) {
          if (el === targetRef.current) {
            isOuteSide = false;
            break;
          }
          el = el.parentNode;
        }

        cbLive.current(isOuteSide);
      };

      document.addEventListener('click', onDocumentClick, true);
      return () => {
        document.removeEventListener('click', onDocumentClick, true);
      };
    }
  }, [active]);
};

export default useClickDetect;
