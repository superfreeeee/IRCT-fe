import { useEffect, useRef } from 'react';

const usePrev = <T>(prevState: T) => {
  const prev = useRef<T>(null);

  // because useEffect is late than state flow
  useEffect(() => {
    prev.current = prevState;
  }, [prevState]);

  return prev.current;
};

export default usePrev;
