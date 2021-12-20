import { ObserveMouseActionsOptions, UnObserveMouseActions } from './type';

const setListener = (
  event: keyof DocumentEventMap,
  callback: (e: Event) => void
): (() => void) => {
  document.body.addEventListener(event, callback);

  let removeCalled = false;
  return () => {
    if (removeCalled) {
      return;
    }
    document.body.removeEventListener(event, callback);
    removeCalled = true;
  };
};

export const observeMouseActions = (
  options: ObserveMouseActionsOptions
): UnObserveMouseActions => {
  const removeObj: UnObserveMouseActions = {};

  for (const key of Object.keys(options)) {
    const event = key.substring(2).toLowerCase() as keyof DocumentEventMap;
    removeObj[key] = setListener(event, options[key]);
  }

  return removeObj;
};
