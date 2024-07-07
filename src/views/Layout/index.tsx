import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '@/views/Home';
import Main from '../Main';
import { CrafteamRoute } from './type';

const Layout = () => {
  return (
    <Switch>
      <Route exact path={CrafteamRoute.Home} component={Home} />
      <Route exact path={CrafteamRoute.Main} component={Main} />
      <Route>
        <Redirect to={CrafteamRoute.Home} />
      </Route>
    </Switch>
  );
};

export default Layout;
