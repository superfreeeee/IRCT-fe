import { useEffect } from 'react';

import useClosestRef from './useClosestRef';

export const ANY_KEY = '*';

interface KeyDetectListener {
  (e: KeyboardEvent): void;
}
const useKeyDetect = (
  key: string | typeof ANY_KEY,
  cb: KeyDetectListener,
  active: boolean = false,
) => {
  const keyLive = useClosestRef(key);
  const cbLive = useClosestRef(cb);

  useEffect(() => {
    if (active) {
      const onKeyDown = (e: KeyboardEvent) => {
        if ([ANY_KEY, e.key].includes(keyLive.current)) {
          cbLive.current(e);
        }
      };

      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [active]);
};

export default useKeyDetect;
