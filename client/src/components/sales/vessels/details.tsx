import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import useUpdateItem from 'hooks/use-update-item';
import { Country, InventoryItem, Vessel, Warehouse } from 'types';
// import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import InventoryItemList from '../inventory/items/list';
import InventoryListTotals from '../inventory/items/list-totals';
import { convertProjectionsToInventoryItems } from '../inventory/utils';
import { baseLabels } from './data-utils';

export const breadcrumbs = (id: string, isInventory: boolean) => [
  {
    text: isInventory ? 'Inventory' : 'Vessels',
    to: `/sales${isInventory ? '/inventory' : ''}/vessels`,
  },
  {
    text: 'Vessel',
    to: `/sales${isInventory ? '/inventory' : ''}/vessels/${id}`,
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

  const { data, error, loading } = api.useVessel(id);
  const inventoryItems = data
    ? (data.inventoryItems.nodes as InventoryItem[])
    : [];

  const { preInventoryItems } = convertProjectionsToInventoryItems(data);

  const { data: countriesData } = api.useCountries('COUNTRY_NAME_ASC');
  const countries = countriesData ? (countriesData.nodes as Country[]) : [];

  const { data: warehouseData } = api.useAllWarehouses('WAREHOUSE_NAME_ASC');
  const warehouses = warehouseData ? (warehouseData.nodes as Warehouse[]) : [];

  const { TabBar } = useTabBar(tabs);

  const [handleUpdate] = api.useUpdateVessel(id);

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
  const updateVariables = { id };

  const [handleDelete] = api.useDeleteVessel();

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<Vessel>({
      data: data as Vessel,
      handleDelete,
      handleUpdate,
      deleteVariables: updateVariables,
      confirmDeleteText: `Are you sure you want to delete vessel "${
        data ? data.vesselCode : ''
      }"?`,
      updateFields,
      updateVariables,
      validationLabels: baseLabels(countries, warehouses),
    });

  const items = inventoryItems.length > 0 ? inventoryItems : preInventoryItems;

  return (
    <Page
      actions={
        isInventory || !data?.isPre
          ? undefined
          : [
              data?.isPre ? (
                <React.Fragment key="pre">
                  {/* <l.AreaLink
                    to={`/sales/projections?coast=${data?.coast}&startDate=${data?.departureDate}&endDate=${data?.departureDate}&projectionsView=grid&vesselId=${data?.id}&projectionId=all`}
                  >
                    <b.Primary mr={th.spacing.md}>View Projections</b.Primary>
                  </l.AreaLink>
                  <b.Primary mr={th.spacing.md}>Convert to Real</b.Primary> */}
                </React.Fragment>
              ) : null,
              editing
                ? getUpdateActions().defaultActions
                : getUpdateActions().editAction,
            ]
      }
      breadcrumbs={breadcrumbs(id, isInventory)}
      title={
        data
          ? `${data.vesselName} (${data.vesselCode})` || 'Vessel'
          : 'Loading...'
      }
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Vessel>
            data={data}
            changes={changes}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels(countries, warehouses)}
            showValidation={saveAttempt}
          />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <InventoryListTotals items={items} loading={loading} />
          </l.Flex>
          <InventoryItemList baseUrl={`/sales/vessels/${id}`} items={items} />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
