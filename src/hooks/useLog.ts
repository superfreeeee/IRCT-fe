import { useEffect } from 'react';

/**
 * 打印改动变量
 * @param obj
 * @param namespace
 */
const useLog = (obj: { [name: string]: any }, namespace: string = '') => {
  const prefix = namespace ? `[${namespace}]` : '';
  Object.entries(obj).map(([name, val]) => {
    useEffect(() => {
      console.log(`${prefix} ${name}`, val);
    }, [val]);
  });
};

export default useLog;
