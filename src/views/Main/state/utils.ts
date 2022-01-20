import { StateNamespace } from './type';

export const createPrefixer =
  (namespace: StateNamespace) => (fieldName: string) =>
    `${namespace}_${fieldName}`;
