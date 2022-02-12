import { MutableRefObject, useRef } from 'react';

/**
 * 将 val 值转换成 ref 引用
 *   保证每次重新渲染时 ref 持有最新数值
 * @param val
 * @returns
 */
const useClosestRef = <T>(
  val: T,
  targetRef?: MutableRefObject<T>,
): MutableRefObject<T> => {
  const valRef = useRef(null);
  valRef.current = val;
  targetRef && (targetRef.current = val);
  return valRef;
};

export default useClosestRef;
