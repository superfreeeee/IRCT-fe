import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { CrafteamRoute } from './type';
import { LazyHome } from '../Home/lazy';
import { LazyMain, preloadMain } from '../Main/lazy';

setTimeout(() => {
  preloadMain();
}, 300);

const Layout = () => {
  return (
    <Switch>
      <Route exact path={CrafteamRoute.Home} component={LazyHome} />
      <Route exact path={CrafteamRoute.Main} component={LazyMain} />
      <Route>
        <Redirect to={CrafteamRoute.Home} />
      </Route>
    </Switch>
  );
};

export default Layout;
