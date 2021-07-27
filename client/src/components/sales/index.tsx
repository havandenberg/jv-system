import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Agenda from 'components/sales/agenda';
import Calendar from 'components/sales/calendar';
import PriceSheet from 'components/sales/price-sheet';

const Sales = () => (
  <Switch>
    <Route exact path="/sales/price-sheet" component={PriceSheet} />
    <Route exact path="/sales/agenda" component={Agenda} />
    <Route exact path="/sales/calendar" component={Calendar} />
    <Redirect to="/sales/price-sheet" />
  </Switch>
);

export default Sales;
