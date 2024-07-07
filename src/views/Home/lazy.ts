import { createLazyComp } from '@/utils/lazy';

export const {
  preload: preloadHome, //
  LazyComp: LazyHome,
} = createLazyComp(() => import('./Home'));
