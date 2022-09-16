import React, { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { isEmpty, uniq } from 'ramda';

import api from 'api';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useActiveUser } from 'components/user/context';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import {
  useOrdersQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { CommonSpecies, OrderEntry, OrderItem, OrderMaster } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import {
  convertOrderEntriesToOrderMasters,
  indexListLabels,
} from './data-utils';
import { indexListLabels as itemIndexListLabels } from './items/data-utils';
import useOrdersFilters from './use-filters';

export const breadcrumbs = [{ text: 'Orders', to: `/inventory/orders` }];

const orderMasterGridTemplateColumns =
  '90px 90px 110px 1fr 3fr 100px 60px 30px';

const orderItemGridTemplateColumns =
  '70px 1fr 70px 50px 1fr 80px 80px 40px 80px 50px 30px';

const Orders = () => {
  const {
    roles: { isSalesAssoc },
  } = useActiveUser();

  const [{ sortBy = 'expectedShipDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [selectedFilters] = useOrdersQueryParams();

  const isOrders = !selectedFilters.view || selectedFilters.view === 'orders';

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
  } = api.useOrderMasters(isOrders ? undefined : 'EXPECTED_SHIP_DATE_DESC');
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

  const { components, coast, filteredOrders, filteredOrderItems } =
    useOrdersFilters({
      commonSpecieses,
      expanded,
      items,
      loading,
      toggleExpanded,
    });

  const ordersGroupedByLocation = filteredOrders.reduce((acc, item) => {
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

  const hasProductFilters = [
    'species',
    'variety',
    'size',
    'packType',
    'plu',
    'label',
    'vesselCode',
    'shipper',
    'location',
    'countryOfOrigin',
  ].some((key) => selectedFilters[key]);

  const allOrders = orders.concat(
    hasProductFilters ? [] : convertOrderEntriesToOrderMasters(entryItems),
  );

  const salesAssocOptions = uniq(
    allOrders.map(({ salesUser }) => salesUser?.userCode || ''),
  ) as string[];

  const sortedOrders = getSortedItems(
    indexListLabels,
    allOrders,
    sortBy,
    sortOrder,
  );

  const sortedOrderItems = getSortedItems(
    itemIndexListLabels(selectedFilters, salesAssocOptions),
    filteredOrderItems,
    sortBy,
    sortOrder,
  );

  const orderItemColumnLabels = useColumns<OrderItem>(
    'productId',
    SORT_ORDER.DESC,
    itemIndexListLabels(selectedFilters, salesAssocOptions),
    'operations',
    'order_item',
  );

  const orderMasterColumnLabels = useColumns(
    'expectedShipDate',
    SORT_ORDER.DESC,
    indexListLabels,
    'operations',
    'order_master',
  );

  const columnLabels = isOrders
    ? orderMasterColumnLabels
    : orderItemColumnLabels;

  const gridTemplateColumns = isOrders
    ? orderMasterGridTemplateColumns
    : orderItemGridTemplateColumns;

  return (
    <Page
      actions={
        isSalesAssoc
          ? [
              <l.AreaLink
                key="create"
                to={`/inventory/orders/create?coast=${coast}`}
              >
                <b.Success>New Order</b.Success>
              </l.AreaLink>,
              <l.AreaLink
                key="load-numbers"
                ml={th.spacing.lg}
                to={`/inventory/orders/load-numbers`}
              >
                <b.Primary>Load Numbers</b.Primary>
              </l.AreaLink>,
            ]
          : undefined
      }
      breadcrumbs={breadcrumbs}
      extraPaddingTop={expanded ? 248 : 156}
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
      {!loading && isOrders && !isEmpty(sortedOrders) ? (
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
                    to={`/inventory/orders/${item.orderId}?orderView=${
                      item.entryUserCode ? 'pickupLocations' : 'orderEntries'
                    }`}
                  />
                </div>
              )
            );
          }}
        />
      ) : !isEmpty(sortedOrderItems) ? (
        <VirtualizedList
          height={expanded ? 440 : 542}
          rowCount={data ? sortedOrderItems.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = sortedOrderItems[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<OrderItem>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    highlightColor={th.colors.status.warningSecondary}
                    isHalfHighlight={
                      differenceInDays(
                        new Date(
                          item.order?.expectedShipDate.replace(/-/g, '/'),
                        ),
                        new Date(
                          item.inventoryItem?.vessel?.dischargeDate.replace(
                            /-/g,
                            '/',
                          ),
                        ),
                      ) > 7
                    }
                    listLabels={itemIndexListLabels(
                      selectedFilters,
                      salesAssocOptions,
                    )}
                    to={`/inventory/orders/${item.orderId}?backOrderId=${item?.backOrderId}&orderView=orderItems`}
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
