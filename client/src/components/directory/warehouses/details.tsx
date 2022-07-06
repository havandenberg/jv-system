import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useUpdateItem from 'hooks/use-update-item';
import { PersonContact, Warehouse } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { useDirectorySelectionContext } from '../selection-context';
import { baseLabels } from './data-utils';

export const warehouseBreadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/warehouses`,
  },
  { text: 'Warehouse', to: `/directory/warehouses/${id}` },
];

const tabs: Tab[] = [
  {
    id: 'contacts',
    text: 'Contacts',
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { data, error, loading } = api.useWarehouse(id);
  const personContacts = data
    ? data.personContactsByWarehousePersonContactWarehouseIdAndPersonContactId
        .nodes
    : [];

  const { TabBar } = useTabBar(tabs);

  const [handleUpdate] = api.useUpdateWarehouse(id);

  const updateFields = [
    'warehouseName',
    'phone',
    'address1',
    'address2',
    'address3',
    'city',
    'postalState',
    'outQueue',
    'stateTaxCode',
    'countyTaxCode',
    'cityTaxCode',
    'miscTaxCode',
  ];
  const updateVariables = { id };

  const { changes, editing, handleChange } = useUpdateItem<Warehouse>({
    data: data as Warehouse,
    handleUpdate,
    updateFields,
    updateVariables,
  });

  const [
    selectedItems,
    {
      selectWarehousePersonContact,
      isAllWarehousePersonContactsSelected,
      toggleAllWarehousePersonContacts,
    },
  ] = useDirectorySelectionContext();

  const selectedWarehouse = selectedItems.warehouses.find((c) => c.id === id);

  return (
    <Page
      actions={
        data
          ? [
              <l.AreaLink key={0} to={`/sales/inventory?location=${data.id}`}>
                <b.Primary>Inventory</b.Primary>
              </l.AreaLink>,
            ]
          : []
      }
      breadcrumbs={warehouseBreadcrumbs(id)}
      title={data ? data.warehouseName : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Warehouse>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels}
          />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.AreaLink
              key={1}
              ml={th.spacing.md}
              to={`/directory/create?warehouseId=${data.id}`}
            >
              <b.Primary>Create</b.Primary>
            </l.AreaLink>
          </l.Flex>
          <ContactList
            baseUrl={`warehouses/${id}`}
            personContacts={personContacts as PersonContact[]}
            selectedItem={selectedWarehouse}
            selectContact={selectWarehousePersonContact(data)}
            toggleAllContacts={() => toggleAllWarehousePersonContacts(data)}
            isAllContactsSelected={isAllWarehousePersonContactsSelected(data)}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
