import { createLazyComp } from '@/utils/lazy';

export const {
  preload: preloadMain, //
  LazyComp: LazyMain,
} = createLazyComp(() => import('./index'));
