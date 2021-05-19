import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Tab, useTabBar } from 'components/tab-bar';
import useSearch from 'hooks/use-search';

import CustomerDirectory from './customers';
import CustomerDetails from './customers/details';
import ShipperDirectory from './shippers';
import ShipperDetails from './shippers/details';
import InternalDirectory from './internal';
import InternalDetails from './internal/details';
import WarehouseDirectory from './warehouses';
import WarehouseDetails from './warehouses/details';
import SendEmailModal from './send-email';

export const breadcrumbs = [{ text: 'Directory', to: `/directory` }];

export enum DirectoryTypes {
  ALIASES = 'aliases',
  WAREHOUSES = 'warehouses',
  INTERNAL = 'internal',
  SHIPPERS = 'shippers',
  CUSTOMERS = 'customers',
}

const tabs: Tab[] = [
  {
    id: DirectoryTypes.ALIASES,
    text: 'Aliases',
    to: `/directory/${DirectoryTypes.ALIASES}`,
    disabled: true,
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

interface SelectedItem {
  id: string;
  email: string;
  description: string;
}

export interface SelectionState {
  aliases: SelectedItem[];
  internal: SelectedItem[];
  shippers: SelectedItem[];
  customers: SelectedItem[];
  warehouses: SelectedItem[];
}

const initialSelectionState = {
  aliases: [],
  warehouses: [],
  internal: [],
  shippers: [],
  customers: [],
};

export interface SubDirectoryProps {
  actions: React.ReactNode;
  Search: React.ReactNode;
  selectedItems: SelectedItem[];
  selectItem: (item: SelectedItem) => void;
  TabBar: React.ReactNode;
  toggleSelectAll: (isAllSelected: boolean, allItems: SelectedItem[]) => void;
}

const Directory = () => {
  const { Search } = useSearch();
  const { selectedTabId, TabBar } = useTabBar(tabs, true);

  const [selectedItems, setSelectedItems] = useState<SelectionState>(
    initialSelectionState,
  );

  const selectItem = (type: keyof SelectionState) => (item: SelectedItem) => {
    const selectedValues = selectedItems[type];
    if (selectedValues.find((it) => it.id === item.id)) {
      const newValues = selectedValues.filter((it) => it.id !== item.id);
      setSelectedItems({
        ...selectedItems,
        [type]: newValues.length > 0 ? newValues : [],
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        [type]: [...selectedValues, item],
      });
    }
  };

  const toggleSelectAll = (
    isAllSelected: boolean,
    allItems: SelectedItem[],
  ) => {
    if (!isAllSelected) {
      setSelectedItems({
        ...selectedItems,
        [selectedTabId]: allItems,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        [selectedTabId]: [],
      });
    }
  };

  const subDirectoryProps = {
    actions: [<SendEmailModal key={0} selectedEmails={selectedItems} />],
    Search,
    TabBar: <TabBar />,
    toggleSelectAll,
  };

  return (
    <Switch>
      <Route exact path="/directory/internal/:id" component={InternalDetails} />
      <Route
        exact
        path="/directory/internal"
        render={() => (
          <InternalDirectory
            selectedItems={selectedItems['internal']}
            selectItem={selectItem('internal')}
            {...subDirectoryProps}
          />
        )}
      />
      <Route
        exact
        path="/directory/shippers/:id"
        render={() => <ShipperDetails />}
      />
      <Route
        exact
        path="/directory/shippers"
        render={() => (
          <ShipperDirectory
            selectedItems={selectedItems['shippers']}
            selectItem={selectItem('shippers')}
            {...subDirectoryProps}
          />
        )}
      />
      <Route
        exact
        path="/directory/customers/:id"
        render={() => <CustomerDetails />}
      />
      <Route
        exact
        path="/directory/customers"
        render={() => (
          <CustomerDirectory
            selectedItems={selectedItems['customers']}
            selectItem={selectItem('customers')}
            {...subDirectoryProps}
          />
        )}
      />
      <Route
        exact
        path="/directory/warehouses/:id"
        component={WarehouseDetails}
      />
      <Route
        exact
        path="/directory/warehouses"
        render={() => (
          <WarehouseDirectory
            selectedItems={selectedItems['warehouses']}
            selectItem={selectItem('warehouses')}
            {...subDirectoryProps}
          />
        )}
      />
      <Redirect to="/directory/internal" />
    </Switch>
  );
};

export default Directory;
