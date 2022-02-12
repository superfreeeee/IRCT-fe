import { DependencyList, useCallback, useRef } from 'react';

import useForceUpdate from './useForceUpdate';

const useShadowState = <T>(
  originState: T,
  deps: DependencyList = [],
): [T, (newValue: T) => void] => {
  const shadowRef = useRef<T>(originState);

  /**
   * setState
   */
  const forceUpdate = useForceUpdate();
  const setState = useCallback((newValue: T) => {
    forceUpdate(() => {
      shadowRef.current = newValue;
    });
  }, []);

  /**
   * detect origin state change
   */
  const prevRef = useRef<T>(originState);
  const prevDepsRef = useRef(deps);
  if (
    prevRef.current !== originState ||
    prevDepsRef.current.some((v, i) => v !== deps[i])
  ) {
    // 原始状态修改时，同步到影子状态上（不触发第二次更新）
    prevRef.current = shadowRef.current = originState;
    prevDepsRef.current = deps;
  }

  return [shadowRef.current, setState];
};

export default useShadowState;
