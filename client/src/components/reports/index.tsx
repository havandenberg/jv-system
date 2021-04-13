import React from 'react';
import { Route } from 'react-router-dom';

import Inspections from 'components/reports/inspections';

const Reports = () => (
  <Route path="/reports/inspections/:routeTabId?" component={Inspections} />
);

export default Reports;
