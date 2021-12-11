import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from '@views/Home';
import Main from '../Main';

const Layout = () => {
  return (
    <Switch>
      {/* <Route exact path="/" component={Home}></Route> */}
      <Route exact path="/main" component={Main}></Route>
      <Route exact path="/" component={Main}></Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default Layout;
