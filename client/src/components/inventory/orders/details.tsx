import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import StepTracker from 'components/step-tracker';
import { Tab, useTabBar } from 'components/tab-bar';
import usePrevious from 'hooks/use-previous';
import { useOrdersQueryParams } from 'hooks/use-query-params';
import { OrderEntry, OrderItem, OrderMaster } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels, indexBaseLabels } from './data-utils';
import { baseLabels as entryBaseLabels } from './entry/data-utils';
import OrderEntryList from './entry/list';
import OrderItemList from './items/list';
import OrderMasterList from './list';

export const breadcrumbs = (id: string) => [
  {
    text: 'Orders',
    to: `/inventory/orders`,
  },
  {
    text: 'Order',
    to: `/inventory/orders/${id}`,
  },
];

const orderMasterTabs: (
  itemCount: number,
  pickupCount: number,
  entriesCount: number,
) => Tab[] = (itemCount, pickupCount, entriesCount) => [
  ...(itemCount > 0
    ? [
        {
          id: 'pickupLocations',
          text: `Pickups${pickupCount ? ' (' + pickupCount + ')' : ''}`,
        },
        {
          id: 'orderItems',
          text: `Items${itemCount ? ' (' + itemCount + ')' : ''}`,
        },
      ]
    : []),
  {
    id: 'orderEntries',
    text: `Entries ${entriesCount ? ' (' + entriesCount + ')' : ''}`,
  },
];

const orderItemTabs: (itemCount: number) => Tab[] = (itemCount) => [
  {
    id: 'orderItems',
    text: `Items${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const orderSteps = [
  {
    id: 'submitted',
    text: 'Submitted',
  },
  {
    id: 'reviewing',
    text: 'Review',
  },
  {
    id: 'loading',
    text: 'Loading',
  },
  {
    id: 'shipped',
    text: 'Shipped',
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const [{ backOrderId }, setOrdersParams] = useOrdersQueryParams();

  const {
    data: orderEntriesData,
    loading: orderEntriesLoading,
    error: orderEntriesError,
  } = api.useOrderEntry(id);
  const orderEntries = (
    orderEntriesData ? orderEntriesData.nodes : []
  ) as OrderEntry[];
  const latestOrderEntry = orderEntries[0];

  const {
    data,
    error: orderMastersError,
    loading: orderMastersLoading,
  } = api.useOrderMaster(id);
  const orderMasters = ((data?.nodes || []) as OrderMaster[]).filter(
    (orderMaster) => `${orderMaster?.orderId}` === id,
  );
  const orderMaster = orderMasters[backOrderId ? backOrderId : 0];

  const hasData = orderMaster || orderEntries.length > 0;
  const loading = orderMastersLoading || orderEntriesLoading;
  const prevLoading = usePrevious(loading);
  const error = orderMastersError || orderEntriesError;

  const allItems = backOrderId
    ? orderMaster?.items.nodes || []
    : orderMasters
        .map(({ items }) => (items.nodes || []) as OrderItem[])
        .flat() || [];

  const {
    TabBar: OrderMasterTabBar,
    handleSelectTab,
    selectedTabId: selectedOrderMasterTab,
  } = useTabBar(
    orderMasterTabs(allItems.length, orderMasters.length, orderEntries.length),
  );
  const { TabBar: OrderItemTabBar } = useTabBar(orderItemTabs(allItems.length));

  useEffect(() => {
    if (prevLoading && !loading) {
      handleSelectTab(orderMaster ? 'pickupLocations' : 'orderEntries');
    }
  });

  const isPickups =
    selectedOrderMasterTab === 'pickupLocations' && !backOrderId;
  const isEntries = selectedOrderMasterTab === 'orderEntries';

  const { totalPallets, totalSellPrice } = allItems.reduce(
    (acc, item) => ({
      totalPallets: acc.totalPallets + parseInt(item?.palletCount, 10) || 0,
      totalSellPrice:
        acc.totalSellPrice +
        (parseFloat(item?.unitSellPrice) || 0) *
          (parseInt(item?.boxCount, 10) || 0),
    }),
    { totalPallets: 0, totalSellPrice: 0 } as {
      totalPallets: number;
      totalSellPrice: number;
    },
  );

  const [orderStepId] = useState(orderSteps[1]?.id);

  const clearBackOrderId = () => {
    setOrdersParams({ backOrderId: undefined });
  };

  return (
    <Page
      actions={[
        <l.AreaLink
          key={0}
          ml={th.spacing.lg}
          to={`/inventory/orders/${id}/edit`}
        >
          <b.Primary>Edit</b.Primary>
        </l.AreaLink>,
      ]}
      breadcrumbs={breadcrumbs(id)}
      centerAction={
        <StepTracker currentStepId={orderStepId} steps={orderSteps} />
      }
      title={hasData ? 'Order' : 'Loading...'}
    >
      {hasData ? (
        <l.Div pb={th.spacing.xl}>
          {orderMaster ? (
            <BaseData<OrderMaster>
              data={orderMaster}
              labels={indexBaseLabels}
            />
          ) : (
            <>
              <ty.BodyText italic mb={th.spacing.md} secondary>
                Viewing latest entry:
              </ty.BodyText>
              <BaseData<OrderEntry>
                data={latestOrderEntry}
                labels={entryBaseLabels}
              />
            </>
          )}
          <l.Div mt={th.spacing.md} />
          {orderMaster && backOrderId && (
            <>
              <l.Flex alignCenter justifyBetween my={th.spacing.md}>
                <ty.CaptionText>Pickup Location:</ty.CaptionText>
                <b.Primary onClick={clearBackOrderId}>Show All</b.Primary>
              </l.Flex>
              <BaseData<OrderMaster> data={orderMaster} labels={baseLabels} />
            </>
          )}
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            {backOrderId ? <OrderItemTabBar /> : <OrderMasterTabBar />}
            <l.Flex alignCenter>
              <ty.CaptionText mr={th.spacing.lg}>
                Total Pallets:{' '}
                <ty.Span bold ml={th.spacing.xs}>
                  {loading ? '-' : totalPallets}
                </ty.Span>
              </ty.CaptionText>
              <ty.CaptionText color={th.colors.brand.primaryAccent}>
                Total Sell Price:{' '}
                <ty.Span bold ml={th.spacing.xs}>
                  {loading
                    ? '-'
                    : totalSellPrice.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                </ty.Span>
              </ty.CaptionText>
            </l.Flex>
          </l.Flex>
          {isEntries ? (
            <OrderEntryList baseUrl={`orders/`} items={orderEntries} />
          ) : isPickups ? (
            <OrderMasterList
              baseUrl={`orders/`}
              items={orderMasters as OrderMaster[]}
            />
          ) : (
            <OrderItemList
              baseUrl={`orders/${id}`}
              items={(allItems || []) as OrderItem[]}
            />
          )}
        </l.Div>
      ) : (
        <DataMessage data={[]} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
