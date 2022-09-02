import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { OrderEntry, OrderEntryItem } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels } from './data-utils';

export const breadcrumbs = (orderId: string, entryId: string) => [
  {
    text: 'Orders',
    to: `/inventory/orders`,
  },
  {
    text: 'Order',
    to: `/inventory/orders/${orderId}`,
  },
  {
    text: 'Entry',
    to: `/inventory/orders/${orderId}/entry/${entryId}`,
  },
];

const tabs: (itemCount: number) => Tab[] = (itemCount) => [
  {
    id: 'orderItems',
    text: `Items${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const Details = () => {
  const { orderId, entryId } = useParams<{
    entryId: string;
    orderId: string;
  }>();

  const { data, loading, error } = api.useOrderEntry(orderId);
  const orderEntries = (data ? data.nodes : []) as OrderEntry[];
  const latestOrderEntry = orderEntries[orderEntries.length - 1];
  const orderEntry = entryId
    ? orderEntries.find((entry) => entry && entry.id === entryId)
    : latestOrderEntry;
  const isLatestEntry = latestOrderEntry?.id === orderEntry?.id;

  const allItems = (orderEntry?.orderEntryItems?.nodes ||
    []) as OrderEntryItem[];

  const { TabBar } = useTabBar(tabs(allItems.length));

  return (
    <Page
      actions={[
        isLatestEntry ? (
          <l.AreaLink
            key={0}
            ml={th.spacing.lg}
            to={`/inventory/orders/${orderId}/edit`}
          >
            <b.Primary>Edit</b.Primary>
          </l.AreaLink>
        ) : (
          <l.AreaLink
            key={0}
            to={`/inventory/orders/${orderId}/entry/${latestOrderEntry.id}`}
          >
            <b.Primary>Show Latest</b.Primary>
          </l.AreaLink>
        ),
      ]}
      breadcrumbs={breadcrumbs(orderId, entryId)}
      title={orderEntries.length > 0 ? 'Order Entry' : 'Loading...'}
    >
      {orderEntries.length > 0 ? (
        <l.Div pb={th.spacing.xl}>
          {orderEntry && (
            <>
              <ty.BodyText italic mb={th.spacing.md} secondary>
                Viewing {isLatestEntry ? 'latest' : 'previous'} entry:
              </ty.BodyText>
              <BaseData<OrderEntry> data={orderEntry} labels={baseLabels} />
            </>
          )}
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
          </l.Flex>
          {/* <OrderEntryItemList
            baseUrl={`orders/${orderId}`}
            items={(allItems || []) as OrderItem[]}
          /> */}
        </l.Div>
      ) : (
        <DataMessage data={orderEntries} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
