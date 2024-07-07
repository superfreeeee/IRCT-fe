import React, { Suspense } from 'react';

export const createLazyComp = (loader: () => Promise<{ default: any }>) => {
  const LazyComp = React.lazy(loader);

  return {
    preload: loader,
    LazyComp: (...props) => (
      <Suspense fallback={null}>
        <LazyComp {...props} />
      </Suspense>
    ),
  };
};
