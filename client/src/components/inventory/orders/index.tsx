import React, { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { isEmpty, uniq } from 'ramda';
import { useLocation } from 'react-router-dom';

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
import {
  CommonSpecies,
  InvoiceHeader,
  OrderEntry,
  OrderItem,
  OrderMaster,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import { IS_PRODUCTION } from 'utils/env';

import {
  convertInvoiceHeadersToOrderMasters,
  convertOrderEntriesToOrderMasters,
  indexListLabels,
  OrderItemInvoiceItem,
  OrderMasterInvoiceHeader,
} from './data-utils';
import { indexListLabels as itemIndexListLabels } from './items/data-utils';
import useOrdersFilters from './use-filters';

export const breadcrumbs = (isInvoices: boolean) => [
  {
    text: isInvoices ? 'Invoices' : 'Orders',
    to: isInvoices ? '/accounting/invoices' : '/inventory/orders',
  },
];

const orderMasterGridTemplateColumns = (isInvoices: boolean) =>
  `90px 90px${isInvoices ? ' 90px' : ''} 110px 1fr 3fr 100px 60px 30px`;

const orderItemGridTemplateColumns =
  '70px 1fr 70px 50px 1fr 80px 80px 40px 80px 50px 30px';

const Orders = () => {
  const { pathname } = useLocation();
  const isInvoices = pathname.includes('accounting/invoices');

  const {
    roles: { isSalesAssoc },
  } = useActiveUser();

  const [{ sortBy = 'expectedShipDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [selectedFilters] = useOrdersQueryParams();

  const isOrders =
    !selectedFilters.view ||
    ['invoices', 'orders'].includes(selectedFilters.view);

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
  } = api.useOrders(
    isOrders && !isInvoices ? undefined : 'EXPECTED_SHIP_DATE_DESC',
  );
  const orderMasters = (data ? data.nodes : []) as OrderMaster[];

  const {
    data: invoicesData,
    loading: invoicesLoading,
    error: invoicesError,
  } = api.useInvoices(isOrders ? undefined : 'EXPECTED_SHIP_DATE_DESC');
  const invoices = (invoicesData ? invoicesData.nodes : []) as InvoiceHeader[];

  const items = isInvoices
    ? convertInvoiceHeadersToOrderMasters(invoices)
    : orderMasters;
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = api.useCommonSpecieses();
  const commonSpecieses = (productsData?.nodes || []) as CommonSpecies[];

  const loading =
    (isInvoices ? invoicesLoading : ordersLoading) ||
    productsLoading ||
    orderEntriesLoading;
  const error =
    (isInvoices ? invoicesError : ordersError) ||
    invoicesError ||
    productsError ||
    orderEntriesError;

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const { components, coast, filteredOrders, filteredOrderItems } =
    useOrdersFilters({
      commonSpecieses,
      expanded,
      items,
      isInvoices,
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
    hasProductFilters || isInvoices
      ? []
      : convertOrderEntriesToOrderMasters(entryItems),
  );

  const salesAssocOptions = uniq(
    allOrders.map(({ salesUser }) => salesUser?.userCode || ''),
  ) as string[];

  const sortedOrders = getSortedItems(
    indexListLabels(isInvoices),
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
    indexListLabels(isInvoices),
    'operations',
    isInvoices ? 'invoice_header' : 'order_master',
  );

  const columnLabels = isOrders
    ? orderMasterColumnLabels
    : orderItemColumnLabels;

  const gridTemplateColumns = isOrders
    ? orderMasterGridTemplateColumns(isInvoices)
    : orderItemGridTemplateColumns;

  return (
    <Page
      actions={
        isSalesAssoc && !isInvoices
          ? [
              !IS_PRODUCTION && (
                <l.AreaLink
                  key="create"
                  to={`/inventory/orders/create?coast=${coast}`}
                >
                  <b.Success>New Order</b.Success>
                </l.AreaLink>
              ),
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
      breadcrumbs={breadcrumbs(isInvoices)}
      extraPaddingTop={expanded ? 240 : 148}
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
      title={isInvoices ? 'Customer Invoices' : 'Orders'}
    >
      {!loading ? (
        isOrders ? (
          !isEmpty(sortedOrders) ? (
            <VirtualizedList
              height={expanded ? 440 : 542}
              rowCount={data ? sortedOrders.length : 0}
              rowRenderer={({ key, index, style }) => {
                const item = sortedOrders[index];
                return (
                  item && (
                    <div key={key} style={style}>
                      <ListItem<OrderMasterInvoiceHeader>
                        data={item}
                        gridTemplateColumns={gridTemplateColumns}
                        listLabels={indexListLabels(isInvoices)}
                        to={`/${
                          isInvoices
                            ? 'accounting/invoices'
                            : 'inventory/orders'
                        }/${item.orderId}?orderView=${
                          isInvoices || item.entryUserCode
                            ? 'pickupLocations'
                            : 'orderEntries'
                        }`}
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
                header: `No ${isInvoices ? 'invoices' : 'orders'} found`,
                text: 'Modify search parameters to view more results.',
              }}
            />
          )
        ) : !isEmpty(sortedOrderItems) ? (
          <VirtualizedList
            height={expanded ? 440 : 542}
            rowCount={data ? sortedOrderItems.length : 0}
            rowRenderer={({ key, index, style }) => {
              const item = sortedOrderItems[index] as OrderItemInvoiceItem;
              return (
                item && (
                  <div key={key} style={style}>
                    <ListItem<OrderItemInvoiceItem>
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
                      to={`/${
                        isInvoices ? 'accounting/invoices' : 'inventory/orders'
                      }/${item.orderId}?${
                        isInvoices
                          ? ''
                          : 'backOrderId=' + item?.backOrderId + '&'
                      }&orderView=orderItems`}
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
              header: `No ${isInvoices ? 'invoice' : 'order'} items found`,
              text: 'Modify search parameters to view more results.',
            }}
          />
        )
      ) : (
        <DataMessage
          data={sortedOrders}
          error={error}
          loading={loading}
          emptyProps={{
            header: `No ${isInvoices ? 'invoices' : 'orders'} found`,
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Orders;
