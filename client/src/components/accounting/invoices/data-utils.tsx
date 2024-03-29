import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { InvoiceHeader } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';
import th from 'ui/theme';
import { formatDate } from 'components/date-range-picker';

export type InvoiceHeaderLabelInfo = LabelInfo<InvoiceHeader>;

export const listLabels: InvoiceHeaderLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
  {
    key: 'invoiceId',
    label: 'Invoice ID',
  },
  {
    key: 'truckLoadId',
    label: 'Load ID',
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
    key: 'customerPo',
    label: 'Customer PO',
  },
  {
    key: 'invoiceDate',
    label: 'Invoice Date',
    getValue: ({ invoiceDate }) =>
      formatDate(new Date(invoiceDate.replace(/-/g, '/'))),
  },
  {
    key: 'billingCustomerId',
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
    key: 'salesUserCode',
    label: 'Sales Assoc.',
    getValue: ({ salesUser }) =>
      salesUser ? (
        <ty.BodyText>{salesUser.personContact?.firstName}</ty.BodyText>
      ) : (
        ''
      ),
  },
];

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
    key: 'fob',
    label: 'FOB / Del',
    getValue: ({ truckLoad }) => (
      <ty.BodyText>
        {truckLoad ? (truckLoad.fob ? 'FOB' : 'Delivery') : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'actualShipDate',
    label: 'Ship Date',
    isDate: true,
  },
  {
    key: 'expectedShipDate',
    label: 'Delivered Date',
    isDate: true,
    getValue: ({ expectedShipDate, truckLoad }) => (
      <ty.BodyText>
        {truckLoad
          ? truckLoad.fob
            ? '-'
            : formatDate(new Date(expectedShipDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
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

export const getInvoicePalletCounts = (invoice: InvoiceHeader) => ({
  totalPallets: invoice?.items?.nodes?.length || 0,
  totalRejectedPallets:
    invoice?.rejectedInvoices?.nodes?.map((ih) => ih?.items?.nodes)?.flat()
      .length || 0,
});

export const isInvoicePaidInFull = (invoice: InvoiceHeader) =>
  invoice.paidCode === 'P' || parseFloat(invoice.netAmountDue) === 0;

export const isInvoiceUnpaid = (invoice: InvoiceHeader) =>
  ![invoice.totalAmount, invoice.netAmountDue].includes(null) &&
  parseFloat(invoice.totalAmount).toFixed(2) ===
    (parseFloat(invoice.netAmountDue) - parseFloat(invoice.amountOwed)).toFixed(
      2,
    );

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
