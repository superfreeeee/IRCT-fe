import { useCallback, useState } from 'react';

const useForceUpdate = () => {
  const [, setBool] = useState(false);

  const forceUpdate = useCallback((cb?: () => void) => {
    setBool((bool) => {
      cb && cb();
      return !bool;
    });
  }, []);

  return forceUpdate;
};

export default useForceUpdate;
