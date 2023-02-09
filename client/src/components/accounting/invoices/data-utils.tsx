import { sum, uniqBy } from 'ramda';

import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { InvoiceHeader } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';
import th from 'ui/theme';

export type InvoiceHeaderLabelInfo = LabelInfo<InvoiceHeader>;

export const baseLabels: InvoiceHeaderLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
  {
    key: 'truckLoadId',
    label: 'Truck Load',
    getValue: ({ truckLoad, truckLoadId }) =>
      truckLoad || truckLoadId ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/truck-loads/${
            truckLoad?.loadId || truckLoadId
          }?truckLoadView=pallets`}
        >
          {truckLoad?.loadId || truckLoadId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'billingCustomerId',
    sortKey: 'billingCustomerId',
    label: 'Customer',
    getValue: ({ billingCustomer }) =>
      billingCustomer ? (
        <ty.LinkText
          hover="false"
          to={`/directory/customers/${billingCustomer.id}`}
        >
          {billingCustomer.id} - {billingCustomer.customerName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'customerPo',
    label: 'Customer PO',
  },
  {
    key: 'salesUserCode',
    label: 'Sales Assoc.',
    getValue: ({ salesUser }) =>
      salesUser ? (
        <ty.BodyText>{salesUser.personContact?.firstName}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'invoiceId',
    label: 'Invoice ID',
  },
  {
    key: 'actualShipDate',
    label: 'Ship Date',
    isDate: true,
  },
  {
    key: 'paidCode',
    label: 'Paid Code',
    getValue: ({ paidCode }) => {
      const status = invoiceStatusDescriptions[paidCode || ''];
      return (
        <l.Flex alignCenter justifyCenter>
          {status ? (
            <StatusIndicator
              color={status?.color}
              text={status?.text}
              title={status?.title}
            />
          ) : (
            <ty.BodyText>-</ty.BodyText>
          )}
        </l.Flex>
      );
    },
  },
];

export const getTotalInvoiceAmount = (invoice: InvoiceHeader) =>
  parseFloat(
    (
      sum(
        invoice?.totalAmountsByVesselAndShipper.nodes.map((value) => {
          const amount = value?.split(',')[2];
          return amount ? parseFloat(amount) : 0;
        }) || [],
      ) + parseFloat(invoice?.amountOwed || '0')
    ).toFixed(2),
  );

export const getInvoicePalletCounts = (invoice: InvoiceHeader) => ({
  totalPallets: invoice?.items?.nodes?.length || 0,
  totalRejectedPallets:
    invoice?.rejectedInvoices?.nodes?.map((ih) => ih?.items?.nodes)?.flat()
      .length || 0,
});

export const getInvoiceNetAmountDue = (invoice: InvoiceHeader) => {
  const totalInvoiceAmount = getTotalInvoiceAmount(invoice);
  const netAmountDue = parseFloat(invoice?.netAmountDue || '0');

  const totalCreditedAmount = parseFloat(
    invoice?.totalAmountsByVesselAndShipper?.nodes
      ?.find((value) => value?.split(',')[0] === 'CCC')
      ?.split(',')[2] || '0',
  );

  const rejectedInvoices = invoice?.rejectedInvoices?.nodes || [];
  const totalRejectedAmount = sum(
    rejectedInvoices.map((ih) => (ih ? getTotalInvoiceAmount(ih) : 0)) || [],
  );

  const deletedAmounts = uniqBy(
    (iih) => iih?.split(',')[0],
    invoice?.deletedItemAmounts?.nodes || [],
  ).map((iih) => (iih?.split(',')[1] ? parseFloat(iih?.split(',')[1]) : 0));
  const totalDeletedAmount = parseFloat(sum(deletedAmounts).toFixed(2));

  const calculatedNetAmountDue = parseFloat(
    (
      totalInvoiceAmount +
      totalRejectedAmount -
      totalCreditedAmount +
      totalDeletedAmount
    ).toFixed(2),
  );

  const isFullAmountDue = [calculatedNetAmountDue, totalInvoiceAmount].includes(
    netAmountDue,
  );

  return isFullAmountDue ? -1 : netAmountDue - totalRejectedAmount;
};

export const invoiceStatusDescriptions: {
  [key: string]: { color: string; text: string; title: string };
} = {
  P: {
    color: th.colors.status.successAlt,
    text: 'PAID',
    title: 'Paid in full',
  },
  X: {
    color: th.colors.status.warning,
    text: 'UNP',
    title: 'Unpaid or partially paid',
  },
};
