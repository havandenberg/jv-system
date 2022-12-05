import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Expenses from 'components/accounting/expenses';
import Invoices from 'components/inventory/orders';
import InvoiceDetails from 'components/accounting/invoices/details';
import Unpaids from 'components/accounting/unpaids';
import VesselControlLog from 'components/accounting/vessel-control';

const Accounting = () => (
  <Switch>
    <Route path="/accounting/invoices/:id" component={InvoiceDetails} />
    <Route path="/accounting/invoices" component={Invoices} />

    <Route path="/accounting/expenses" component={Expenses} />

    <Route path="/accounting/unpaids" component={Unpaids} />
    <Route path="/accounting/vessel-control" component={VesselControlLog} />

    <Redirect to="/accounting/invoices" />
  </Switch>
);

export default Accounting;
