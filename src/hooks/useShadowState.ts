import { useEffect, useState } from 'react';

const useShadowState = <T>(originState: T): [T, (newValue: T) => void] => {
  const [state, setState] = useState(originState);

  // 原始状态修改时，同步到影子状态上
  useEffect(() => {
    setState(originState);
  }, [originState]);

  return [state, setState];
};

export default useShadowState;
