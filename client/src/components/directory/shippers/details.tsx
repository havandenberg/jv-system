import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useUpdateItem from 'hooks/use-update-item';
import { PersonContact, ProductSpecies, Shipper, ShipperAdvance } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { useDirectorySelectionContext } from '../selection-context';
import {
  baseLabels,
  transformChangesOnUpdate,
  validationLabels,
} from './data-utils';
import ShipperAdvanceList from './advances/list';

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
  {
    id: 'advances',
    text: 'Advance Rates',
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
  const advances = (data ? data.shipperAdvances.nodes : []) as ShipperAdvance[];

  const { data: productSpeciesData } = api.useProductSpeciesList();
  const speciesList = (productSpeciesData?.nodes || []) as ProductSpecies[];

  const { TabBar, selectedTabId } = useTabBar({
    tabs,
    isRoute: false,
    paramName: 'shipperView',
  });
  const isContacts = selectedTabId === 'contacts';

  const [handleUpdate] = api.useUpdateShipper(id);

  const updateFields = [
    'shipperName',
    'groupId',
    'notes',
    'psaShipperId',
    'website',
    'vesselControlDaysUntilDue',
    'commissionRate',
  ];
  const updateVariables = { id };

  const [newItemNextId, setNewItemNextId] = useState(-1);

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<Shipper>({
      data: data as Shipper,
      handleUpdate,
      transformChangesOnUpdate: (changes) =>
        transformChangesOnUpdate(changes as Shipper, advances),
      updateFields,
      updateVariables,
      validationLabels: validationLabels(speciesList),
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

  const handleAddAdvance = () => {
    const updatedItems = [
      ...changes.shipperAdvances.nodes,
      {
        id: newItemNextId,
        speciesId: '',
        advanceAmount: '0',
      },
    ];
    handleChange('shipperAdvances', {
      ...changes?.shipperAdvances,
      nodes: updatedItems,
    });

    setNewItemNextId(newItemNextId - 1);
  };

  const handleChangeAdvance = (updatedItem: ShipperAdvance) => {
    const updatedItems = changes.shipperAdvances.nodes.map((item) =>
      item?.id === updatedItem.id ? updatedItem : item,
    );
    handleChange('shipperAdvances', {
      ...changes.shipperAdvances,
      nodes: updatedItems,
    });
  };

  const handleRemoveAdvance = (itemId: number) => {
    const updatedItems = changes.shipperAdvances.nodes.filter(
      (item) => item?.id !== itemId,
    );
    handleChange('shipperAdvances', {
      ...changes.shipperAdvances,
      nodes: updatedItems,
    });
  };

  return (
    <Page
      actions={[
        ...getUpdateActions().defaultActions,
        ...(data && !editing
          ? [
              <l.AreaLink
                key="inventory"
                ml={th.spacing.lg}
                mr={th.spacing.md}
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
              data.psaShipperId ? (
                <l.AreaLink
                  key="inspections"
                  to={`/reports/inspections?exporterName=${data.shipperName}%20%28${data.id}%29`}
                >
                  <b.Primary>Inspections</b.Primary>
                </l.AreaLink>
              ) : (
                <b.Primary disabled key="inspections">
                  Inspections
                </b.Primary>
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
            {isContacts && !editing ? (
              <l.AreaLink
                key={1}
                ml={th.spacing.md}
                to={`/directory/create?shipperId=${data.id}`}
              >
                <b.Success>Create</b.Success>
              </l.AreaLink>
            ) : (
              <div />
            )}
          </l.Flex>
          {isContacts ? (
            <ContactList
              baseUrl={`${id}`}
              personContacts={personContacts as PersonContact[]}
              selectedItem={selectedShipper}
              selectContact={selectShipperPersonContact(data)}
              toggleAllContacts={() => toggleAllShipperPersonContacts(data)}
              isAllContactsSelected={isAllShipperPersonContactsSelected(data)}
            />
          ) : (
            <ShipperAdvanceList
              advances={
                (changes?.shipperAdvances.nodes || []) as ShipperAdvance[]
              }
              editing={editing}
              handleAdd={handleAddAdvance}
              handleChange={handleChangeAdvance}
              handleRemove={handleRemoveAdvance}
              saveAttempt={saveAttempt}
              speciesList={speciesList}
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
