import React from 'react';
import { useParams } from 'react-router-dom';
import { BooleanParam, useQueryParam } from 'use-query-params';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { useActiveUser } from 'components/user/context';
import { SORT_ORDER } from 'hooks/use-columns';
import { useQueryValue, useSortQueryParams } from 'hooks/use-query-params';
import useUpdateItem from 'hooks/use-update-item';
import { Container, Country, InventoryItem, Vessel, Warehouse } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import ContainerList from '../containers/list';
import InventoryItemList from '../inventory/items/list';
import InventoryListTotals from '../inventory/items/list-totals';
import {
  convertProjectionsToInventoryItems,
  getDetailedFilteredItems,
  getGroupedItems,
} from '../inventory/utils';
import { baseLabels } from './data-utils';

export const breadcrumbs = (id: string, isPre: boolean) => [
  {
    text: 'Vessels',
    to: '/inventory/vessels',
  },
  {
    text: 'Vessel',
    to: `/inventory/vessels/${id}?isPre=${isPre ? 1 : 0}`,
  },
];

const tabs: (containersCount: number) => Tab[] = (containersCount) => [
  {
    id: 'inventoryItems',
    text: 'Inventory Items',
  },
  ...(containersCount > 0
    ? [
        {
          id: 'containers',
          text: `Containers (${containersCount})`,
        },
      ]
    : []),
];

const Details = () => {
  const {
    roles: { isEditSchedule },
  } = useActiveUser();
  const { id } = useParams<{
    id: string;
  }>();
  const [{ sortBy }, setSortParams] = useSortQueryParams();
  const [secondaryDetailsIndex, setSecondaryDetailsIndex] = useQueryValue(
    'secondaryDetailsIndex',
  );
  const [isPre] = useQueryParam('isPre', BooleanParam);

  const { data, error, loading } = api.useVessel(id, !!isPre);
  const vessels = (data?.nodes || []) as Vessel[];
  const vessel = vessels[vessels.length - 1];
  const inventoryItems = vessel
    ? (vessel.inventoryItems.nodes as InventoryItem[])
    : [];
  const containers = vessel ? (vessel.containers.nodes as Container[]) : [];

  const { preInventoryItems } = convertProjectionsToInventoryItems(vessel);

  const { data: countriesData } = api.useCountries('COUNTRY_NAME_ASC');
  const countries = countriesData ? (countriesData.nodes as Country[]) : [];

  const { data: warehouseData } = api.useAllWarehouses('WAREHOUSE_NAME_ASC');
  const warehouses = warehouseData ? (warehouseData.nodes as Warehouse[]) : [];

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(containers.length),
    isRoute: false,
    paramName: 'vesselView',
  });
  const isInventoryItems =
    selectedTabId === 'inventoryItems' || containers.length === 0;

  const [handleUpdate] = api.useUpdateVessel(id, !!isPre);

  const updateFields = ['isAvailable', 'scheduleNotes'];
  const updateVariables = { id: vessel?.id || 0 };

  const [handleDelete] = api.useDeleteVessel();

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<Vessel>({
      data: vessel as Vessel,
      handleDelete,
      handleUpdate,
      deleteVariables: updateVariables,
      confirmDeleteText: `Are you sure you want to delete vessel "${
        vessel ? vessel.vesselCode : ''
      }"?`,
      updateFields,
      updateVariables,
      validationLabels: baseLabels(countries, warehouses),
    });

  const updateActions = getUpdateActions();

  const items = inventoryItems.length > 0 ? inventoryItems : preInventoryItems;

  const groupedItems = getGroupedItems(items, false);

  const filteredItems = secondaryDetailsIndex
    ? getDetailedFilteredItems(items, secondaryDetailsIndex)
    : groupedItems;

  const clearSecondaryDetails = () => {
    setSecondaryDetailsIndex(undefined);
    if (
      ![
        'shipper',
        'species',
        'palletsReceived',
        'palletsOnHand',
        'palletsAvailable',
      ].includes(sortBy)
    ) {
      setSortParams({ sortBy: 'species', sortOrder: SORT_ORDER.ASC });
    }
  };

  return (
    <Page
      actions={[
        isEditSchedule
          ? editing
            ? updateActions.defaultActions
            : updateActions.editAction
          : null,
        <b.Primary disabled key="projections" ml={th.spacing.lg}>
          Projections
        </b.Primary>,
        vessel?.isPre ? (
          <b.Primary disabled key="pre" ml={th.spacing.md}>
            Convert to Real
          </b.Primary>
        ) : null,
        vessel ? (
          <l.AreaLink
            key="inspections"
            ml={th.spacing.md}
            to={`/reports/inspections/arrival?arrivalCode=${vessel.vesselCode}%20-%20${vessel.vesselName}`}
          >
            <b.Primary>Inspections</b.Primary>
          </l.AreaLink>
        ) : (
          <b.Primary disabled key="inspections" ml={th.spacing.md}>
            Inspections
          </b.Primary>
        ),
      ]}
      breadcrumbs={breadcrumbs(id, !!vessel?.isPre)}
      title={
        vessel
          ? `${vessel.vesselName} (${vessel.vesselCode})` || 'Vessel'
          : 'Loading...'
      }
    >
      {vessels && vessel ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Vessel>
            data={vessel}
            changes={changes}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels(countries, warehouses)}
            showValidation={saveAttempt}
          />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <l.Flex alignCenter>
              <TabBar />
              {secondaryDetailsIndex && (
                <l.HoverButton
                  dark
                  ml={th.spacing.lg}
                  onClick={clearSecondaryDetails}
                >
                  <ty.CaptionText>Show All</ty.CaptionText>
                </l.HoverButton>
              )}
            </l.Flex>
            {isInventoryItems ? (
              <InventoryListTotals
                items={secondaryDetailsIndex ? filteredItems : items}
                loading={loading}
              />
            ) : (
              <div />
            )}
          </l.Flex>
          {isInventoryItems ? (
            <InventoryItemList
              baseUrl={`/inventory/vessels/${id}`}
              items={filteredItems}
            />
          ) : (
            <ContainerList containers={containers} />
          )}
        </l.Div>
      ) : (
        <DataMessage data={vessels || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
