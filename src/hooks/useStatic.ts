import { useRef } from 'react';

/**
 * store first value and throw others
 */
const useStatic = <T>(val: T): T => {
  const valRef = useRef(val);
  return valRef.current;
};

export default useStatic;
