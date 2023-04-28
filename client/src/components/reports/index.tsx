import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Inspections from 'components/reports/inspections';
import SalesReports from 'components/reports/sales';

const Reports = () => (
  <Switch>
    <Route path="/reports/inspections/:routeTabId?" component={Inspections} />
    <Route path="/reports/sales" component={SalesReports} />
    <Redirect to="/reports/inspections" />
  </Switch>
);

export default Reports;
