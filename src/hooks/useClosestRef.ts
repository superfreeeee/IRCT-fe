import { MutableRefObject, useEffect, useRef } from 'react';

import useForceUpdate from './useForceUpdate';

const useClosestRef = <T>(
  val: T,
  isSame?: (t1: T, t2: T) => boolean
): MutableRefObject<T> => {
  const valRef = useRef(val);

  useEffect(() => {
    const same = isSame || ((t1: T, t2: T) => t1 === t2);
    if (!same(val, valRef.current)) {
      valRef.current = val;
    }
  }, [val]);

  return valRef;
};

export default useClosestRef;
