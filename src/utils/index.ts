import { EventHandler, SyntheticEvent } from 'react';

export const noop = () => {};

export const wrapFn = (fn: () => void): EventHandler<SyntheticEvent> => {
  const wrapper = (e: SyntheticEvent) => {
    e.preventDefault();
    fn();
  };

  return wrapper;
};
