import { useEffect } from 'react';

const useWaitFor = (
  hit: boolean | (() => boolean),
  cb: () => void,
  isWaiting: boolean,
) => {
  // 每次组件更新时检测状态
  useEffect(() => {
    if (isWaiting) {
      const active = typeof hit === 'boolean' ? hit : hit();
      if (active) {
        cb();
      }
    }
  });
};

export default useWaitFor;
