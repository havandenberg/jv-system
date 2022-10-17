import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import TruckRateList from 'components/inventory/truck-loads/rates/list';
import { SORT_ORDER } from 'hooks/use-columns';
import { useQueryValue, useSortQueryParams } from 'hooks/use-query-params';
import useUpdateItem from 'hooks/use-update-item';
import { PersonContact, TruckRate, Vendor } from 'types';
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

const tabs: (isFreight: boolean) => Tab[] = (isFreight) => [
  {
    id: 'contacts',
    text: 'Contacts',
  },
  ...(isFreight
    ? [
        {
          id: 'rates',
          text: 'Rates',
        },
      ]
    : []),
];

const Details = () => {
  const [{ sortBy }, setSortQueryParams] = useSortQueryParams();
  const [view] = useQueryValue('view');
  const { id } = useParams<{
    id: string;
  }>();
  const { data, error, loading } = api.useVendor(
    id,
    view === 'rates' ? 'FIRST_NAME_ASC' : undefined,
  );
  const personContacts = data
    ? data.personContactsByVendorPersonContactVendorIdAndPersonContactId.nodes
    : [];

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(data?.vendorType === 'FR'),
    defaultTabId: 'contacts',
    paramName: 'view',
  });
  const isRates = selectedTabId === 'rates';

  const [handleUpdate] = api.useUpdateVendor(id);

  const updateFields = ['vendorName', 'notes'];
  const updateVariables = { id };

  const { changes, editing, handleChange, getUpdateActions } =
    useUpdateItem<Vendor>({
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
  useEffect(() => {
    if (selectedTabId === 'rates') {
      if (!['vendorId', 'postalState', 'isDefault'].includes(sortBy)) {
        setSortQueryParams(
          {
            sortBy: 'postalState',
            sortOrder: SORT_ORDER.ASC,
          },
          'replaceIn',
        );
      }
    } else {
      if (['vendorId', 'postalState', 'isDefault'].includes(sortBy)) {
        setSortQueryParams(
          {
            sortBy: 'firstName',
            sortOrder: SORT_ORDER.ASC,
          },
          'replaceIn',
        );
      }
    }
  }, [selectedTabId, setSortQueryParams, sortBy]);

  return (
    <Page
      actions={getUpdateActions().defaultActions}
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
              to={
                isRates
                  ? `/directory/vendors/${data.id}/rates/create`
                  : `/directory/create?vendorId=${data.id}`
              }
            >
              <b.Success>Create</b.Success>
            </l.AreaLink>
          </l.Flex>
          {isRates ? (
            <TruckRateList
              baseUrl={`/directory/vendors/${data.id}`}
              truckRates={(data.truckRates?.nodes || []) as TruckRate[]}
            />
          ) : (
            <ContactList
              baseUrl={`${id}`}
              personContacts={personContacts as PersonContact[]}
              selectedItem={selectedVendor}
              selectContact={selectVendorPersonContact(data)}
              toggleAllContacts={() => toggleAllVendorPersonContacts(data)}
              isAllContactsSelected={isAllVendorPersonContactsSelected(data)}
            />
          )}
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
