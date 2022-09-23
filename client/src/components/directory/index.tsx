import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import GroupDirectory from './groups';
import CreateContactGroup from './groups/create';
import GroupDetails from './groups/details';
import CustomerDirectory from './customers';
import CustomerDetails from './customers/details';
import ShipperDirectory from './shippers';
import ShipperDetails from './shippers/details';
import ContactDirectory from './contacts';
import CreatePersonContact from './contacts/create';
import ContactDetails from './contacts/details';
import WarehouseDirectory from './warehouses';
import WarehouseDetails from './warehouses/details';
import VendorDirectory from './vendors';
import VendorDetails from './vendors/details';
import SendMessage from './send-message';

export const breadcrumbs = (slug: string) => [
  { text: 'Directory', to: `/directory/${slug}` },
];

export enum DirectoryTypes {
  GROUPS = 'groups',
  WAREHOUSES = 'warehouses',
  INTERNAL = 'internal',
  SHIPPERS = 'shippers',
  CUSTOMERS = 'customers',
  VENDORS = 'vendors',
}

export interface SubDirectoryProps {
  actions: React.ReactNode[];
}

const Directory = () => {
  const subDirectoryProps = {
    actions: [<SendMessage key={0} />],
  };

  return (
    <Switch>
      <Route exact path="/directory/create" component={CreatePersonContact} />
      <Route exact path="/directory/internal/:id" component={ContactDetails} />
      <Route
        exact
        path="/directory/internal"
        render={() => <ContactDirectory {...subDirectoryProps} />}
      />
      <Route
        exact
        path="/directory/groups/create"
        component={CreateContactGroup}
      />
      <Route exact path="/directory/groups/:id" component={GroupDetails} />
      <Route
        exact
        path="/directory/groups"
        render={() => <GroupDirectory {...subDirectoryProps} />}
      />
      <Route
        exact
        path="/directory/shippers/:shipperId/contacts/:id"
        component={ContactDetails}
      />
      <Route
        exact
        path="/directory/shippers/:id"
        render={() => <ShipperDetails />}
      />
      <Route
        exact
        path="/directory/shippers"
        render={() => <ShipperDirectory {...subDirectoryProps} />}
      />
      <Route
        exact
        path="/directory/customers/:customerId/contacts/:id"
        component={ContactDetails}
      />
      <Route
        exact
        path="/directory/customers/:id"
        render={() => <CustomerDetails />}
      />
      <Route
        exact
        path="/directory/customers"
        render={() => <CustomerDirectory {...subDirectoryProps} />}
      />
      <Route
        exact
        path="/directory/warehouses/:warehouseId/contacts/:id"
        component={ContactDetails}
      />
      <Route
        exact
        path="/directory/warehouses/:id"
        component={WarehouseDetails}
      />
      <Route
        exact
        path="/directory/warehouses"
        render={() => <WarehouseDirectory {...subDirectoryProps} />}
      />
      <Route
        exact
        path="/directory/vendors/:vendorId/contacts/:id"
        component={ContactDetails}
      />
      <Route exact path="/directory/vendors/:id" component={VendorDetails} />
      <Route
        exact
        path="/directory/vendors"
        render={() => <VendorDirectory {...subDirectoryProps} />}
      />
      <Redirect to="/directory/internal" />
    </Switch>
  );
};

export default Directory;
