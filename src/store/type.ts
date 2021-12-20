import { Action } from 'redux';

export interface CommonAction<T> extends Action<T> {
  payload?: any;
}
