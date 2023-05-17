import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Checks from 'components/accounting/checks';
import CheckDetails from 'components/accounting/checks/details';
import Expenses from 'components/accounting/expenses';
import Invoices from 'components/inventory/orders';
import InvoiceDetails from 'components/accounting/invoices/details';
import Unpaids from 'components/accounting/unpaids';
import VesselControlLog from 'components/accounting/vessel-control';
import WireControlLog from 'components/accounting/wire-control';
import Wires from 'components/accounting/wire-requests';
import WireDetails from 'components/accounting/wire-requests/details';
import CreateWire from './wire-requests/create';

const Accounting = () => (
  <Switch>
    <Route path="/accounting/checks/:checkNumber" component={CheckDetails} />
    <Route path="/accounting/checks" component={Checks} />

    <Route path="/accounting/invoices/:id" component={InvoiceDetails} />
    <Route path="/accounting/invoices" component={Invoices} />

    <Route path="/accounting/expenses" component={Expenses} />

    <Route path="/accounting/unpaids" component={Unpaids} />
    <Route path="/accounting/vessel-control" component={VesselControlLog} />
    <Route path="/accounting/wire-control" component={WireControlLog} />

    <Route path="/accounting/wires/create" component={CreateWire} />
    <Route path="/accounting/wires/:id" component={WireDetails} />
    <Route path="/accounting/wires" component={Wires} />

    <Redirect to="/accounting/invoices" />
  </Switch>
);

export default Accounting;
