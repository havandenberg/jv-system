import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Agenda from 'components/inventory/agenda';
import PriceSheet from 'components/inventory/price-sheet';

const Inventory = () => (
  <Switch>
    <Route exact path="/inventory/price-sheet" component={PriceSheet} />
    <Route exact path="/inventory/agenda" component={Agenda} />
    <Redirect to="/inventory/price-sheet" />
  </Switch>
);

export default Inventory;
