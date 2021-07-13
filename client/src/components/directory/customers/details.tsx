import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useUpdateItem from 'hooks/use-update-item';
import { Customer, PersonContact } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { useDirectorySelectionContext } from '../selection-context';
import { baseLabels } from './data-utils';

export const customerBreadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/customers`,
  },
  { text: 'Customer', to: `/directory/customers/${id}` },
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
  const { data, error, loading } = api.useCustomer(id);
  const personContacts = data
    ? data.personContactsByCustomerPersonContactCustomerIdAndPersonContactId
        .nodes
    : [];

  const { TabBar } = useTabBar(tabs);

  const [handleUpdate] = api.useUpdateCustomer(id);

  const updateFields = [
    'customerName',
    'phone',
    'address1',
    'address2',
    'city',
    'postalState',
    'zipCode',
    'countryId',
    'notes',
    'website',
  ];
  const updateVariables = { id };

  const { changes, editing, handleChange } = useUpdateItem<Customer>({
    data: data as Customer,
    handleUpdate,
    updateFields,
    updateVariables,
  });

  const [
    selectedItems,
    {
      selectCustomerPersonContact,
      isAllCustomerPersonContactsSelected,
      toggleAllCustomerPersonContacts,
    },
  ] = useDirectorySelectionContext();

  const selectedCustomer = selectedItems.customers.find((c) => c.id === id);

  return (
    <Page
      breadcrumbs={customerBreadcrumbs(id)}
      title={data ? data.customerName : 'Directory - Customer'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Customer>
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
              to={`/directory/create?customerId=${data.id}`}
            >
              <b.Primary>Create</b.Primary>
            </l.AreaLink>
          </l.Flex>
          <ContactList
            baseUrl={`customers/${id}`}
            personContacts={personContacts as PersonContact[]}
            selectedItem={selectedCustomer}
            selectContact={selectCustomerPersonContact(data)}
            toggleAllContacts={() => toggleAllCustomerPersonContacts(data)}
            isAllContactsSelected={isAllCustomerPersonContactsSelected(data)}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
