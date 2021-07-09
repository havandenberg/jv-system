import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Tab, useTabBar } from 'components/tab-bar';

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
}

const tabs: Tab[] = [
  {
    id: DirectoryTypes.GROUPS,
    text: 'Groups',
    to: `/directory/${DirectoryTypes.GROUPS}`,
  },
  {
    id: DirectoryTypes.INTERNAL,
    text: 'Internal',
    to: `/directory/${DirectoryTypes.INTERNAL}`,
  },
  {
    id: DirectoryTypes.CUSTOMERS,
    text: 'Customers',
    to: `/directory/${DirectoryTypes.CUSTOMERS}`,
  },
  {
    id: DirectoryTypes.SHIPPERS,
    text: 'Shippers',
    to: `/directory/${DirectoryTypes.SHIPPERS}`,
  },
  {
    id: DirectoryTypes.WAREHOUSES,
    text: 'Warehouses',
    to: `/directory/${DirectoryTypes.WAREHOUSES}`,
  },
];

export interface SubDirectoryProps {
  actions: React.ReactNode[];
  TabBar: React.ReactNode;
}

const Directory = () => {
  const { TabBar } = useTabBar(tabs, true);

  const subDirectoryProps = {
    actions: [<SendMessage key={0} />],
    TabBar: <TabBar />,
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
      <Redirect to="/directory/internal" />
    </Switch>
  );
};

export default Directory;
