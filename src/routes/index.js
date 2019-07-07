import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/Home';
import Merchants from './merchants';
import Database from './database';

export default () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/merchants" component={Merchants} />
    <Route path="/database" component={Database} />
  </Switch>
);
