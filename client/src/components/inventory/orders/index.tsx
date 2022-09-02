import React, { useState } from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { CommonSpecies, OrderEntry, OrderMaster } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import {
  convertOrderEntriesToOrderMasters,
  getSortedItems,
  indexListLabels,
} from './data-utils';
import ListItem from './list-item';
import useOrdersFilters from './use-filters';

export const breadcrumbs = [{ text: 'Orders', to: `/inventory/orders` }];

const gridTemplateColumns = '90px 90px 110px 1fr 3fr 100px 60px 30px';

const Orders = () => {
  const [{ sortBy = 'expectedShipDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();

  const {
    data: orderEntriesData,
    loading: orderEntriesLoading,
    error: orderEntriesError,
  } = api.useOrderEntries('FOB_DATE_DESC');
  const entryItems = (
    orderEntriesData ? orderEntriesData.nodes : []
  ) as OrderEntry[];

  const {
    data,
    loading: ordersLoading,
    error: ordersError,
  } = api.useOrderMasters();
  const items = (data ? data.nodes : []) as OrderMaster[];

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = api.useCommonSpecieses();
  const commonSpecieses = (productsData?.nodes || []) as CommonSpecies[];

  const loading = ordersLoading || productsLoading || orderEntriesLoading;
  const error = ordersError || productsError || orderEntriesError;

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const { components, coast, filteredItems } = useOrdersFilters({
    commonSpecieses,
    expanded,
    items,
    loading,
    toggleExpanded,
  });

  const ordersGroupedByLocation = filteredItems.reduce((acc, item) => {
    const { orderId } = item || {};
    if (!acc || !orderId) {
      return acc;
    }
    if (!acc[orderId]) {
      acc[orderId] = [];
    }
    acc[orderId].push(item as OrderMaster);
    return acc;
  }, {} as { [key: string]: OrderMaster[] });

  const orders = Object.values(ordersGroupedByLocation)
    .map((orderGroup) => orderGroup[0])
    .flat();

  const allOrders = orders.concat(
    convertOrderEntriesToOrderMasters(entryItems),
  );

  const sortedOrders = getSortedItems(
    indexListLabels,
    allOrders,
    sortBy,
    sortOrder,
  );

  const columnLabels = useColumns<OrderMaster>(
    'expectedShipDate',
    SORT_ORDER.DESC,
    indexListLabels,
    'operations',
    'order_master',
  );

  return (
    <Page
      actions={[
        <l.AreaLink key="create" to={`/inventory/orders/create?coast=${coast}`}>
          <b.Primary>New Order</b.Primary>
        </l.AreaLink>,
      ]}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={expanded ? 258 : 156}
      headerChildren={
        <>
          {components}
          {!loading && (
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              pl={th.spacing.sm}
              pr={data ? (sortedOrders.length > 12 ? th.spacing.md : 0) : 0}
            >
              {columnLabels}
            </l.Grid>
          )}
        </>
      }
      title="Orders"
    >
      {!loading && !isEmpty(sortedOrders) ? (
        <VirtualizedList
          height={expanded ? 440 : 542}
          rowCount={data ? sortedOrders.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = sortedOrders[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<OrderMaster>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={indexListLabels}
                    slug={`orders/${item.orderId}`}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={sortedOrders}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No orders found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Orders;
