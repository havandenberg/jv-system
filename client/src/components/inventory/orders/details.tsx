import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { useActiveUser } from 'components/user/context';
import { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import {
  useOrdersQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
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

const tabs: (
  itemCount: number,
  pickupCount: number,
  entriesCount: number,
) => Tab[] = (itemCount, pickupCount, entriesCount) => [
  ...(itemCount > 0
    ? [
        ...(pickupCount && pickupCount > 1
          ? [
              {
                id: 'pickupLocations',
                text: `Pickups (${pickupCount})`,
              },
            ]
          : []),
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

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    roles: { isOrderEntry, isSalesAssoc },
  } = useActiveUser();

  const [, setSortParams] = useSortQueryParams();
  const [{ backOrderId }, setOrdersParams] = useOrdersQueryParams();

  const {
    data: orderEntriesData,
    loading: orderEntriesLoading,
    error: orderEntriesError,
  } = api.useOrderEntry(id);
  const orderEntries = (
    orderEntriesData ? orderEntriesData.nodes : []
  ) as OrderEntry[];
  const latestOrderEntry = orderEntries[orderEntries.length - 1];

  const {
    data,
    error: orderMastersError,
    loading: orderMastersLoading,
  } = api.useOrderMaster(id);
  const orderMasters = ((data?.nodes || []) as OrderMaster[]).filter(
    (orderMaster) => `${orderMaster?.orderId}` === id,
  );
  const orderMaster = backOrderId
    ? orderMasters.find(
        (orderMaster) => `${orderMaster?.backOrderId}` === backOrderId,
      )
    : orderMasters[0];

  const hasData = orderMaster || orderEntries.length > 0;
  const loading = orderMastersLoading || orderEntriesLoading;
  const error = orderMastersError || orderEntriesError;

  const allItems = backOrderId
    ? orderMaster?.items.nodes || []
    : orderMasters
        .map(({ items }) => (items.nodes || []) as OrderItem[])
        .flat() || [];

  const { TabBar, selectedTabId } = useTabBar(
    tabs(
      allItems.length,
      backOrderId ? 0 : orderMasters.length,
      orderEntries.length,
    ),
    false,
    'pickupLocations',
    'orderView',
  );
  const prevSelectedTabId = usePrevious(selectedTabId);

  useEffect(() => {
    if (prevSelectedTabId !== selectedTabId) {
      const isEntries = selectedTabId === 'orderEntries';
      setSortParams(
        {
          sortBy: isEntries ? 'orderDate' : 'backOrderId',
          sortOrder: isEntries ? SORT_ORDER.DESC : SORT_ORDER.ASC,
        },
        'replaceIn',
      );
    }
  }, [prevSelectedTabId, selectedTabId, setSortParams]);

  useEffect(() => {
    if (
      orderMasters &&
      orderMasters.length === 1 &&
      orderMaster &&
      !backOrderId
    ) {
      setOrdersParams(
        { backOrderId: `${orderMaster.backOrderId}`, orderView: 'orderItems' },
        'replaceIn',
      );
    }
  }, [backOrderId, orderMasters, orderMaster, setOrdersParams]);

  const isPickups =
    selectedTabId === 'pickupLocations' &&
    !backOrderId &&
    orderMasters.length > 1;
  const isEntries = selectedTabId === 'orderEntries';

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

  const clearBackOrderId = () => {
    setOrdersParams({
      backOrderId: undefined,
      orderView: orderMasters.length > 1 ? 'pickupLocations' : 'orderItems',
    });
  };

  return (
    <Page
      actions={[
        isSalesAssoc && orderEntries.length > 0 ? (
          <l.AreaLink
            key="edit"
            ml={th.spacing.lg}
            to={`/inventory/orders/${id}/edit`}
          >
            <b.Warning>Edit</b.Warning>
          </l.AreaLink>
        ) : null,
        isOrderEntry && orderEntries.length > 0 && (
          <l.AreaLink
            key="review"
            ml={th.spacing.lg}
            to={`/inventory/orders/${id}/review`}
          >
            <b.Warning>Review</b.Warning>
          </l.AreaLink>
        ),
      ]}
      breadcrumbs={breadcrumbs(id)}
      title={hasData ? 'Order' : 'Loading...'}
    >
      {hasData ? (
        <l.Div pb={th.spacing.xl}>
          {orderMaster ? (
            <BaseData<OrderMaster>
              data={orderMaster}
              labels={indexBaseLabels(backOrderId)}
            />
          ) : (
            <>
              <ty.CaptionText italic mb={th.spacing.md} secondary>
                Last entry submitted:
              </ty.CaptionText>
              <BaseData<OrderEntry>
                data={latestOrderEntry}
                labels={entryBaseLabels}
              />
            </>
          )}
          <l.Div mt={th.spacing.md} />
          {orderMaster && (backOrderId || orderMasters.length === 1) && (
            <>
              <l.Flex alignCenter my={th.spacing.md}>
                <ty.CaptionText>Pickup Location:</ty.CaptionText>
                {orderMasters.length > 1 && (
                  <l.HoverButton
                    dark
                    ml={th.spacing.lg}
                    onClick={clearBackOrderId}
                  >
                    <ty.CaptionText>Show All</ty.CaptionText>
                  </l.HoverButton>
                )}
              </l.Flex>
              <BaseData<OrderMaster> data={orderMaster} labels={baseLabels} />
            </>
          )}
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
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
            <OrderEntryList
              baseUrl={`/inventory/orders/`}
              items={orderEntries}
            />
          ) : isPickups ? (
            <OrderMasterList
              baseUrl={`/inventory/orders/`}
              items={orderMasters as OrderMaster[]}
            />
          ) : (
            <OrderItemList items={(allItems || []) as OrderItem[]} />
          )}
        </l.Div>
      ) : (
        <DataMessage data={[]} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
