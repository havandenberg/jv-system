import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import StepTracker from 'components/step-tracker';
import { Tab, useTabBar } from 'components/tab-bar';
import { useOrdersQueryParams } from 'hooks/use-query-params';
import { OrderItem, OrderMaster } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels, indexBaseLabels } from './data-utils';
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

const orderMasterTabs: (itemCount: number, pickupCount: number) => Tab[] = (
  itemCount,
  pickupCount,
) => [
  {
    id: 'pickup-locations',
    text: `Pickups${pickupCount ? ' (' + pickupCount + ')' : ''}`,
  },
  {
    id: 'orderItems',
    text: `Items${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
  {
    id: 'orderEntries',
    text: `Entries${itemCount ? ' (' + itemCount + ')' : ''}`,
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

  const { data, error, loading } = api.useOrderMaster(id);
  const orderMasters = ((data?.nodes || []) as OrderMaster[]).filter(
    (orderMaster) => `${orderMaster?.orderId}` === id,
  );
  const orderMaster = orderMasters[backOrderId ? backOrderId : 0];

  const allItems = backOrderId
    ? orderMaster?.items.nodes || []
    : orderMasters
        .map(({ items }) => (items.nodes || []) as OrderItem[])
        .flat() || [];

  const { TabBar: OrderMasterTabBar, selectedTabId: selectedOrderMasterTab } =
    useTabBar(orderMasterTabs(allItems.length, orderMasters.length));
  const { TabBar: OrderItemTabBar } = useTabBar(orderItemTabs(allItems.length));

  const isPickups =
    selectedOrderMasterTab === 'pickup-locations' && !backOrderId;

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
        <l.Flex alignCenter key={0}>
          <StepTracker currentStepId={orderStepId} steps={orderSteps} />
          <b.Primary ml={th.spacing.lg}>Edit</b.Primary>
        </l.Flex>,
      ]}
      breadcrumbs={breadcrumbs(id)}
      title={orderMaster ? 'Order' : 'Loading...'}
    >
      {orderMaster ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<OrderMaster>
            data={orderMasters[0]}
            labels={indexBaseLabels}
          />
          <l.Div mt={th.spacing.md} />
          {backOrderId && (
            <>
              <l.Flex alignCenter justifyBetween my={th.spacing.md}>
                <ty.CaptionText>Pickup Location:</ty.CaptionText>
                <b.Primary onClick={clearBackOrderId}>Show All</b.Primary>
              </l.Flex>
              <BaseData<OrderMaster>
                data={orderMasters[backOrderId]}
                labels={baseLabels}
              />
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
          {isPickups ? (
            <OrderMasterList
              baseUrl={`orders/`}
              items={(orderMaster ? orderMasters : []) as OrderMaster[]}
            />
          ) : (
            <OrderItemList
              baseUrl={`orders/${id}`}
              items={(allItems || []) as OrderItem[]}
            />
          )}
        </l.Div>
      ) : (
        <DataMessage data={orderMaster || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
