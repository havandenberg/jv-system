import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useUpdateItem from 'hooks/use-update-item';
import { PersonContact, Vendor } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { useDirectorySelectionContext } from '../selection-context';
import { baseLabels } from './data-utils';

export const vendorBreadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/vendors`,
  },
  { text: 'Vendor', to: `/directory/vendors/${id}` },
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
  const { data, error, loading } = api.useVendor(id);
  const personContacts = data
    ? data.personContactsByVendorPersonContactVendorIdAndPersonContactId.nodes
    : [];

  const { TabBar } = useTabBar({ tabs });

  const [handleUpdate] = api.useUpdateVendor(id);

  const updateFields = [
    'vendorName',
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

  const { changes, editing, handleChange } = useUpdateItem<Vendor>({
    data: data as Vendor,
    handleUpdate,
    updateFields,
    updateVariables,
  });

  const [
    selectedItems,
    {
      selectVendorPersonContact,
      isAllVendorPersonContactsSelected,
      toggleAllVendorPersonContacts,
    },
  ] = useDirectorySelectionContext();

  const selectedVendor = selectedItems.vendors.find((c) => c.id === id);

  return (
    <Page
      breadcrumbs={vendorBreadcrumbs(id)}
      title={data ? data.vendorName : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Vendor>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels({
              isShipper: !!data.shipper,
              isCustomer: !!data.customer,
              isWarehouse: !!data.warehouse,
            })}
          />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.AreaLink
              key={1}
              ml={th.spacing.md}
              to={`/directory/create?vendorId=${data.id}`}
            >
              <b.Success>Create</b.Success>
            </l.AreaLink>
          </l.Flex>
          <ContactList
            baseUrl={`${id}`}
            personContacts={personContacts as PersonContact[]}
            selectedItem={selectedVendor}
            selectContact={selectVendorPersonContact(data)}
            toggleAllContacts={() => toggleAllVendorPersonContacts(data)}
            isAllContactsSelected={isAllVendorPersonContactsSelected(data)}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
