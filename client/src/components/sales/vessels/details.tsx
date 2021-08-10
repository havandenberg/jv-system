import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { InventoryItem, Vessel } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import InventoryItemList from '../inventory/items/list';
import InventoryListTotals from '../inventory/items/list-totals';
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
  const { data, error, loading } = api.useVessel(id);
  const inventoryItems = data
    ? (data.inventoryItems.nodes as InventoryItem[])
    : [];

  const { TabBar } = useTabBar(tabs);

  return (
    <Page
      breadcrumbs={breadcrumbs(id, pathname.includes('inventory'))}
      title={
        data
          ? `${data.vesselName} (${data.vesselCode})` || 'Vessel'
          : 'Loading...'
      }
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Vessel> data={data} labels={baseLabels} />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <InventoryListTotals items={inventoryItems} loading={loading} />
          </l.Flex>
          <InventoryItemList
            baseUrl={`/sales/vessels/${id}`}
            items={inventoryItems}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
