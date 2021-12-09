import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Main from '../Main';

const Layout = () => {
  return (
    <Switch>
      <Route path="/" component={Main}></Route>
    </Switch>
  );
};

export default Layout;
