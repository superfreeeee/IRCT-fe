import { EventHandler, SyntheticEvent } from 'react';

export const noop = () => {};

export const wrapFn = (fn: () => void): EventHandler<SyntheticEvent> => {
  const wrapper = (e: SyntheticEvent) => {
    e.preventDefault();
    fn();
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
