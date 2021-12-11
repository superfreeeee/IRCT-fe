import { useCallback, useState } from 'react';

let _bool = false;

const useForceUpdate = () => {
  const [, setBool] = useState(_bool);

  const forceUpdate = useCallback(() => {
    _bool = !_bool;
    setBool(_bool);
  }, []);

  return forceUpdate;
};

export default useForceUpdate;
