export interface ObserveMouseActionsOptions {
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
}

export type UnObserveMouseActions = {
  [key in keyof ObserveMouseActionsOptions]: () => void;
};

export interface PlainFn {
  (): void;
}

export type DataMapper<T> = {
  [key: number | string]: T;
};
