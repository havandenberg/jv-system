import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Tab, useTabBar } from 'components/tab-bar';
import useSearch from 'hooks/use-search';

import CompanyDirectory from './company';
import CompanyDetails from './company/details';
import InternalDirectory from './internal';
import InternalDetails from './internal/details';
import OfficeDirectory from './offices';
import OfficeDetails from './offices/details';
import SendEmailModal from './send-email';

export const breadcrumbs = [{ text: 'Directory', to: `/directory` }];

export enum DirectoryTypes {
  ALIASES = 'aliases',
  OFFICES = 'offices',
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
    id: DirectoryTypes.CUSTOMERS,
    text: 'Customers',
    to: `/directory/${DirectoryTypes.CUSTOMERS}`,
  },
  {
    id: DirectoryTypes.INTERNAL,
    text: 'Internal',
    to: `/directory/${DirectoryTypes.INTERNAL}`,
  },
  {
    id: DirectoryTypes.OFFICES,
    text: 'Offices',
    to: `/directory/${DirectoryTypes.OFFICES}`,
  },
  {
    id: DirectoryTypes.SHIPPERS,
    text: 'Shippers',
    to: `/directory/${DirectoryTypes.SHIPPERS}`,
  },
];

interface SelectedItem {
  id: string;
  email: string;
  description: string;
}

export interface SelectionState {
  aliases: SelectedItem[];
  offices: SelectedItem[];
  internal: SelectedItem[];
  shippers: SelectedItem[];
  customers: SelectedItem[];
}

const initialSelectionState = {
  aliases: [],
  offices: [],
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
        render={() => <CompanyDetails companyType="shipper" />}
      />
      <Route
        exact
        path="/directory/shippers"
        render={() => (
          <CompanyDirectory
            companyType="shipper"
            selectedItems={selectedItems['shippers']}
            selectItem={selectItem('shippers')}
            {...subDirectoryProps}
          />
        )}
      />
      <Route
        exact
        path="/directory/customers/:id"
        render={() => <CompanyDetails companyType="customer" />}
      />
      <Route
        exact
        path="/directory/customers"
        render={() => (
          <CompanyDirectory
            companyType="customer"
            selectedItems={selectedItems['customers']}
            selectItem={selectItem('customers')}
            {...subDirectoryProps}
          />
        )}
      />
      <Route exact path="/directory/offices/:id" component={OfficeDetails} />
      <Route
        exact
        path="/directory/offices"
        render={() => (
          <OfficeDirectory
            selectedItems={selectedItems['offices']}
            selectItem={selectItem('offices')}
            {...subDirectoryProps}
          />
        )}
      />
      <Redirect to="/directory/internal" />
    </Switch>
  );
};

export default Directory;
