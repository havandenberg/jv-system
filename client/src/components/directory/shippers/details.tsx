import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useUpdateItem from 'hooks/use-update-item';
import { PersonContact, Shipper } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { useDirectorySelectionContext } from '../selection-context';
import { baseLabels } from './data-utils';

export const shipperBreadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/shippers`,
  },
  { text: 'Shipper', to: `/directory/shippers/${id}` },
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
  const { data, error, loading } = api.useShipper(id);
  const personContacts = data
    ? data.personContactsByShipperPersonContactShipperIdAndPersonContactId.nodes
    : [];

  const { TabBar } = useTabBar({ tabs });

  const [handleUpdate] = api.useUpdateShipper(id);

  const updateFields = [
    'shipperName',
    'groupId',
    'notes',
    'psaShipperId',
    'website',
    'vesselControlDaysUntilDue',
  ];
  const updateVariables = { id };

  const { changes, editing, handleChange, getUpdateActions } =
    useUpdateItem<Shipper>({
      data: data as Shipper,
      handleUpdate,
      updateFields,
      updateVariables,
    });

  const [
    selectedItems,
    {
      selectShipperPersonContact,
      isAllShipperPersonContactsSelected,
      toggleAllShipperPersonContacts,
    },
  ] = useDirectorySelectionContext();

  const selectedShipper = selectedItems.shippers.find((c) => c.id === id);

  return (
    <Page
      actions={[
        ...getUpdateActions().defaultActions,
        ...(data && !editing
          ? [
              <l.AreaLink
                key="inventory"
                mx={th.spacing.md}
                to={`/inventory/index?shipper=${data.id}`}
              >
                <b.Primary>Inventory</b.Primary>
              </l.AreaLink>,
              <l.AreaLink
                key="programs"
                mr={th.spacing.md}
                to={`/sales/programs?shipperId=${data.id}&programsView=shippers`}
              >
                <b.Primary>Programs</b.Primary>
              </l.AreaLink>,
              <l.AreaLink
                key="projections"
                mr={th.spacing.md}
                to={`/sales/projections?shipperId=${data.id}`}
              >
                <b.Primary disabled>Projections</b.Primary>
              </l.AreaLink>,
              data.psaShipperName ? (
                <l.AreaLink
                  key="inspections"
                  to={`/reports/inspections?exporterName=${data.psaShipperName}`}
                >
                  <b.Primary>Inspections</b.Primary>
                </l.AreaLink>
              ) : (
                <b.Primary disabled>Inspections</b.Primary>
              ),
            ]
          : []),
      ]}
      breadcrumbs={shipperBreadcrumbs(id)}
      title={data ? data.shipperName : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Shipper>
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
              to={`/directory/create?shipperId=${data.id}`}
            >
              <b.Success>Create</b.Success>
            </l.AreaLink>
          </l.Flex>
          <ContactList
            baseUrl={`${id}`}
            personContacts={personContacts as PersonContact[]}
            selectedItem={selectedShipper}
            selectContact={selectShipperPersonContact(data)}
            toggleAllContacts={() => toggleAllShipperPersonContacts(data)}
            isAllContactsSelected={isAllShipperPersonContactsSelected(data)}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
