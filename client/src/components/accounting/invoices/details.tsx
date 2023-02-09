import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import { convertInvoiceHeadersToOrderMasters } from 'components/inventory/orders/data-utils';
import { baseLabels as entryBaseLabels } from 'components/inventory/orders/entry/data-utils';
import OrderEntryList from 'components/inventory/orders/entry/list';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import { useSortQueryParams } from 'hooks/use-query-params';
import { InvoiceHeader, InvoiceItem, OrderEntry } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatCurrency } from 'utils/format';

import {
  baseLabels,
  getInvoiceNetAmountDue,
  getInvoicePalletCounts,
  getTotalInvoiceAmount,
} from './data-utils';
import InvoiceItemList from './items/list';

export const breadcrumbs = (id: string) => [
  {
    text: 'Invoices',
    to: '/accounting/invoices',
  },
  {
    text: 'Invoice',
    to: `/accounting/invoices/${id}`,
  },
];

const tabs: (itemCount: number, entriesCount: number) => Tab[] = (
  itemCount,
  entriesCount,
) => [
  ...(itemCount > 0
    ? [
        {
          id: 'invoiceItems',
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

  const [, setSortParams] = useSortQueryParams();

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
    error: invoiceHeadersError,
    loading: invoiceHeadersLoading,
  } = api.useInvoice(id);

  const invoiceHeaders = ((data?.nodes || []) as InvoiceHeader[]).filter(
    (invoiceHeader) => `${invoiceHeader?.orderId}` === id,
  );
  const invoiceHeader = invoiceHeaders[0];

  const hasData = invoiceHeader || orderEntries.length > 0;
  const loading = invoiceHeadersLoading || orderEntriesLoading;
  const error = invoiceHeadersError || orderEntriesError;

  const allInvoiceItems =
    invoiceHeaders
      .map(({ items }) => (items.nodes || []) as InvoiceItem[])
      .flat() || [];

  const rejectedInvoices = (invoiceHeader?.rejectedInvoices?.nodes ||
    []) as InvoiceHeader[];

  const {
    deletedItems,
    items: allOrderItems,
    rejectedItems,
  } = convertInvoiceHeadersToOrderMasters(
    invoiceHeaders,
    allInvoiceItems,
    rejectedInvoices,
  );

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(allOrderItems.length, orderEntries.length),
    isRoute: false,
    defaultTabId: 'invoiceItems',
    paramName: 'invoiceView',
  });
  const prevSelectedTabId = usePrevious(selectedTabId);

  useEffect(() => {
    if (prevSelectedTabId !== selectedTabId) {
      const isEntries = selectedTabId === 'orderEntries';
      setSortParams(
        {
          sortBy: isEntries ? 'orderDate' : 'lineId',
          sortOrder: isEntries ? SORT_ORDER.DESC : SORT_ORDER.ASC,
        },
        'replaceIn',
      );
    }
  }, [prevSelectedTabId, selectedTabId, setSortParams]);

  const isEntries = selectedTabId === 'orderEntries';

  const { totalPallets, totalRejectedPallets } =
    getInvoicePalletCounts(invoiceHeader);
  const totalInvoiceAmount = getTotalInvoiceAmount(invoiceHeader);
  const netAmountDue = getInvoiceNetAmountDue(invoiceHeader);

  return (
    <Page
      breadcrumbs={breadcrumbs(id)}
      title={hasData ? 'Customer Invoice' : 'Loading...'}
    >
      {hasData ? (
        <l.Div pb={th.spacing.xl}>
          {invoiceHeader ? (
            <BaseData<InvoiceHeader> data={invoiceHeader} labels={baseLabels} />
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
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.Flex alignCenter>
              <l.Flex alignEnd column mr={th.spacing.xl}>
                <ty.CaptionText>
                  Total Pallets:{' '}
                  <ty.Span bold ml={th.spacing.xs}>
                    {loading ? '-' : totalPallets}
                  </ty.Span>
                </ty.CaptionText>
                {!loading && totalRejectedPallets > 0 && (
                  <ty.CaptionText
                    color={th.colors.status.errorAlt}
                    mt={th.spacing.xs}
                  >
                    Rejected:{' '}
                    <ty.Span ml={th.spacing.xs}>{totalRejectedPallets}</ty.Span>
                  </ty.CaptionText>
                )}
              </l.Flex>
              <l.Flex alignEnd column mr={th.spacing.sm}>
                <ty.CaptionText
                  color={th.colors.brand.primaryAccent}
                  mb={th.spacing.xs}
                >
                  Total Invoice Amount:{' '}
                  <ty.Span bold ml={th.spacing.xs}>
                    {loading ? '-' : formatCurrency(totalInvoiceAmount)}
                  </ty.Span>
                </ty.CaptionText>
                {!loading &&
                  (netAmountDue < 0 ? (
                    <ty.CaptionText bold color={th.colors.status.errorAlt}>
                      Unpaid
                    </ty.CaptionText>
                  ) : netAmountDue === 0 ? (
                    <ty.CaptionText bold color={th.colors.status.successAlt}>
                      Paid In Full
                    </ty.CaptionText>
                  ) : (
                    <ty.CaptionText color={th.colors.status.errorAlt}>
                      Net Amount Due:{' '}
                      <ty.Span bold ml={th.spacing.xs}>
                        {formatCurrency(netAmountDue)}
                      </ty.Span>
                    </ty.CaptionText>
                  ))}
              </l.Flex>
            </l.Flex>
          </l.Flex>
          {isEntries ? (
            <OrderEntryList
              baseUrl={`/inventory/orders/`}
              items={orderEntries}
            />
          ) : (
            <InvoiceItemList
              deletedItems={deletedItems}
              items={allOrderItems}
              rejectedItems={rejectedItems}
              rejectedInvoices={rejectedInvoices}
              originalInvoice={invoiceHeader.originalInvoice || undefined}
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
