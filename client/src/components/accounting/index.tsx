import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Expenses from 'components/accounting/expenses';
import Invoices from 'components/inventory/orders';
import InvoiceDetails from 'components/accounting/invoices/details';

const Accounting = () => (
  <Switch>
    <Route path="/accounting/invoices/:id" component={InvoiceDetails} />
    <Route path="/accounting/invoices" component={Invoices} />

    <Route path="/accounting/expenses" component={Expenses} />

    <Redirect to="/accounting/invoices" />
  </Switch>
);

export default Accounting;
