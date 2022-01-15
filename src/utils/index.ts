import { EventHandler, SyntheticEvent } from 'react';

export const noop = () => {};

export const wrapFn = (fn?: () => void): EventHandler<SyntheticEvent> => {
  const wrapper = (e: SyntheticEvent) => {
    e.preventDefault();
    fn && fn();
  };

  return wrapper;
};

/**
 * 打开新页面
 *   使用 window.open(_blank)
 * @param outerLink
 */
export const openNewPage = (outerLink: string) => {
  window.open(outerLink, '_blank');
};

export const scrollToBottom = (target: HTMLDivElement) => {
  target.scrollTo({ top: target.scrollHeight });
};

/**
 * 限制目标数字区间
 * @param target
 * @param min
 * @param max
 */
export const roundBy = (target: number, min?: number, max?: number) => {
  let res = target;
  if (min != null) {
    res = Math.max(res, min);
  }
  if (max != null) {
    res = Math.min(res, max);
  }
  return res;
};

/**
 * 返回当前 hh:mm 时间
 * @returns 
 */
export const getCurrentTime = (): string => {
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}`;
  return time;
};
