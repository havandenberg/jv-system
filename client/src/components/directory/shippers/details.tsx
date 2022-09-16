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

  const { TabBar } = useTabBar(tabs);

  const [handleUpdate] = api.useUpdateShipper(id);

  const updateFields = ['shipperName', 'groupId', 'notes', 'website'];
  const updateVariables = { id };

  const { changes, editing, handleChange } = useUpdateItem<Shipper>({
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
      actions={
        data
          ? [
              <l.AreaLink
                key="inventory"
                mr={th.spacing.lg}
                target="_blank"
                to={`/inventory/index?shipper=${data.id}`}
              >
                <b.Primary>Inventory</b.Primary>
              </l.AreaLink>,
              <l.AreaLink
                key="programs"
                mr={th.spacing.lg}
                target="_blank"
                to={`/sales/programs?shipperId=${data.id}&programsView=shippers`}
              >
                <b.Primary>Programs</b.Primary>
              </l.AreaLink>,
              <l.AreaLink
                key="projections"
                target="_blank"
                to={`/sales/projections?shipperId=${data.id}`}
              >
                <b.Primary disabled>Projections</b.Primary>
              </l.AreaLink>,
            ]
          : []
      }
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
              <b.Primary>Create</b.Primary>
            </l.AreaLink>
          </l.Flex>
          <ContactList
            baseUrl={`shippers/${id}`}
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
