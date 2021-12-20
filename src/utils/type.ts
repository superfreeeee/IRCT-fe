export interface ObserveMouseActionsOptions {
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
}

export type UnObserveMouseActions = {
  [key in keyof ObserveMouseActionsOptions]: () => void;
};
