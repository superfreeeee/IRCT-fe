import { EventHandler, SyntheticEvent } from 'react';
import { DataMapper } from './type';

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

/**
 * 深拷贝
 */
export const deepCopy = (obj: any): any => {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      // for array
      const res = [];
      for (const item of obj) {
        res.push(deepCopy(item));
      }
      return res;
    } else {
      // for obj
      const res = {};
      for (const prop in obj) {
        res[prop] = deepCopy(obj[prop]);
      }
      return res;
    }
  } else {
    return obj;
  }
};

/**
 * 简单防抖
 */
export const simpleThrottle = (cb: Function, delay: number = 300) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(cb, delay, ...args);
  };
};

/**
 * 将 T[] 列表转换为 keyOf(T) => T
 */
export const listToMapper = <T>(
  list: T[],
  keyOf: (item: T) => number | string,
): DataMapper<T> => {
  return list.reduce((mapper, item) => {
    mapper[keyOf(item)] = item;
    return mapper;
  }, {} as DataMapper<T>);
};
