import { DependencyList, useEffect, useState } from 'react';

const useShadowState = <T>(
  originState: T,
  deps: DependencyList = [],
): [T, (newValue: T) => void] => {
  const [state, setState] = useState(originState);

  // 原始状态修改时，同步到影子状态上
  useEffect(() => {
    setState(originState);
  }, [originState, ...deps]);

  return [state, setState];
};

export default useShadowState;
