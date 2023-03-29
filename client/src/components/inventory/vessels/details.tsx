import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { useQueryValue, useSortQueryParams } from 'hooks/use-query-params';
import useUpdateItem from 'hooks/use-update-item';
import { Country, InventoryItem, Vessel, Warehouse } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import InventoryItemList from '../inventory/items/list';
import InventoryListTotals from '../inventory/items/list-totals';
import {
  convertProjectionsToInventoryItems,
  getDetailedFilteredItems,
  getGroupedItems,
} from '../inventory/utils';
import { baseLabels } from './data-utils';
import { SORT_ORDER } from 'hooks/use-columns';
import { BooleanParam, useQueryParam } from 'use-query-params';

export const breadcrumbs = (
  id: string,
  isPre: boolean,
  isInventory: boolean,
) => [
  {
    text: isInventory ? 'Inventory' : 'Vessels',
    to: `/inventory/vessels`,
  },
  {
    text: 'Vessel',
    to: `/inventory/vessels/${id}?isPre=${isPre ? 1 : 0}`,
  },
];

const tabs: Tab[] = [
  {
    id: 'inventoryItems',
    text: 'Inventory Items',
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { pathname } = useLocation();
  const isInventory = pathname.includes('inventory');
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

  const { preInventoryItems } = convertProjectionsToInventoryItems(vessel);

  const { data: countriesData } = api.useCountries('COUNTRY_NAME_ASC');
  const countries = countriesData ? (countriesData.nodes as Country[]) : [];

  const { data: warehouseData } = api.useAllWarehouses('WAREHOUSE_NAME_ASC');
  const warehouses = warehouseData ? (warehouseData.nodes as Warehouse[]) : [];

  const { TabBar } = useTabBar({ tabs });

  const [handleUpdate] = api.useUpdateVessel(vessel?.id || 0);

  const updateFields = [
    'arrivalDate',
    'arrivalPort',
    'coast',
    'countryId',
    'departureDate',
    'dischargeDate',
    'isPre',
    'vesselCode',
    'vesselName',
    'warehouseId',
  ];
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
        vessel && vessel.inspectionVesselName ? (
          <l.AreaLink
            key={0}
            to={`/reports/inspections/arrival?arrivalName=${vessel.inspectionVesselName}`}
          >
            <b.Primary>Inspections</b.Primary>
          </l.AreaLink>
        ) : (
          <b.Primary disabled key={0}>
            Inspections
          </b.Primary>
        ),
        ...(isInventory || !vessel?.isPre
          ? []
          : [
              vessel?.isPre ? (
                <React.Fragment key="pre">
                  {/* <l.AreaLink
                        mx={th.spacing.md}
                        to={`/sales/projections?coast=${data?.coast}&startDate=${data?.departureDate}&endDate=${data?.departureDate}&projectionsView=grid&vesselId=${data?.id}&projectionId=all`}
                      >
                        <b.Primary>View Projections</b.Primary>
                      </l.AreaLink>
                      <b.Primary mr={th.spacing.md}>Convert to Real</b.Primary> */}
                </React.Fragment>
              ) : null,
              editing
                ? getUpdateActions().defaultActions
                : getUpdateActions().editAction,
            ]),
      ]}
      breadcrumbs={breadcrumbs(id, !!vessel?.isPre, isInventory)}
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
            <InventoryListTotals
              items={secondaryDetailsIndex ? filteredItems : items}
              loading={loading}
            />
          </l.Flex>
          <InventoryItemList
            baseUrl={`/inventory/vessels/${id}`}
            items={filteredItems}
          />
        </l.Div>
      ) : (
        <DataMessage data={vessels || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
