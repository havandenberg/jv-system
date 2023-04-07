import { differenceInDays } from 'date-fns';
import { pluck, sortBy } from 'ramda';

import { LabelInfo } from 'components/column-label';
import EditableCell from 'components/editable-cell';
import InfoPanel from 'components/info-panel';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { InvoiceHeader, Unpaid, VesselControl } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatShortDate } from 'utils/date';
import { formatCurrency } from 'utils/format';

import { isInvoicePaidInFull, isInvoiceUnpaid } from '../invoices/data-utils';

export type UnpaidLabelInfo = LabelInfo<Unpaid>;

export const listLabels: (
  handleChange: (updatedItem: Unpaid) => void,
  vesselCodeOptions: string[],
  loadIdOptions: string[],
  invoiceIdOptions: string[],
  customerOptions: string[],
  shipperOptions: string[],
) => UnpaidLabelInfo[] = (
  handleChange,
  vesselCodeOptions,
  loadIdOptions,
  invoiceIdOptions,
  customerOptions,
  shipperOptions,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'vessel',
    label: 'Vsl',
    sortable: true,
    sortKey: 'vesselCode',
    customSortBy: ({ invoice, shipper, vessel }) => {
      const shipDate = new Date(invoice?.actualShipDate.replace(/-/g, '/'));
      return (
        `${vessel?.vesselCode}-${
          shipper?.shipperName
        }-${shipDate?.getTime()}` || ''
      ).toLowerCase();
    },
    filterable: true,
    filterPanelProps: {
      columnCount: 4,
      customOptions: vesselCodeOptions || [],
      showSearch: true,
    },
    getValue: ({ vessel }) =>
      vessel ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/inventory/vessels/${vessel.vesselCode}?isPre=0`}
        >
          {vessel.vesselCode}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{'-'}</ty.BodyText>
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'shipper',
    label: 'Shipper',
    sortable: true,
    customSortBy: ({ invoice, shipper, vessel }) => {
      const shipDate = new Date(invoice?.actualShipDate.replace(/-/g, '/'));
      return (
        `${shipper?.shipperName}-${
          vessel?.vesselCode
        }-${shipDate?.getTime()}` || ''
      ).toLowerCase();
    },
    filterable: true,
    filterPanelProps: {
      customStyles: {
        width: 500,
      },
      customOptions: shipperOptions || [],
      showSearch: true,
    },
    getValue: ({ shipper }) =>
      shipper ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/directory/shippers/${shipper.id}`}
        >
          {shipper.shipperName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{'-'}</ty.BodyText>
      ),
    rowKey: ({ vessel, shipper, invoice }) =>
      `${vessel?.vesselCode}-${shipper?.id}-${invoice?.orderId}`,
  },
  {
    key: 'invoice',
    label: 'Sls',
    getValue: ({ invoice }) => (
      <ty.BodyText>{invoice?.salesUser?.userCode || '-'}</ty.BodyText>
    ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'invoice',
    label: 'Load #',
    sortable: true,
    sortKey: 'loadId',
    customSortBy: ({ invoice }) => invoice?.truckLoadId || '',
    filterable: true,
    filterPanelProps: {
      columnCount: 3,
      customOptions: loadIdOptions || [],
      showSearch: true,
    },
    getValue: ({ invoice }) =>
      invoice ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/inventory/truck-loads/${invoice.truckLoadId}`}
        >
          {invoice.truckLoadId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{'-'}</ty.BodyText>
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'invoice',
    label: 'Invoice #',
    sortable: true,
    sortKey: 'invoiceId',
    customSortBy: ({ invoice }) => invoice?.invoiceId || '',
    filterable: true,
    filterPanelProps: {
      customOptions: invoiceIdOptions || [],
      showSearch: true,
    },
    getValue: ({ invoice }) =>
      invoice ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/accounting/invoices/${invoice.orderId}`}
        >
          {invoice.invoiceId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{'-'}</ty.BodyText>
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'invoice',
    label: 'Ship Date',
    sortable: true,
    sortKey: 'shipDate',
    customSortBy: ({ invoice, shipper, vessel }) => {
      const shipDate = new Date(invoice?.actualShipDate.replace(/-/g, '/'));
      return (
        `${-shipDate?.getTime()}-${vessel?.vesselCode}-${
          shipper?.shipperName
        }` || ''
      ).toLowerCase();
    },
    getValue: ({ invoice }) => (
      <ty.BodyText>
        {invoice?.actualShipDate
          ? formatShortDate(new Date(invoice.actualShipDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'invoice',
    label: 'Age',
    sortable: true,
    sortKey: 'age',
    customSortBy: ({ invoice }) =>
      invoice?.actualShipDate
        ? differenceInDays(
            new Date(),
            new Date(invoice.actualShipDate.replace(/-/g, '/')),
          )
        : '',
    getValue: ({ invoice }) => (
      <ty.BodyText>
        {invoice?.actualShipDate
          ? differenceInDays(
              new Date(),
              new Date(invoice.actualShipDate.replace(/-/g, '/')),
            )
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'invoice',
    label: 'Ship To',
    sortable: true,
    sortKey: 'customer',
    customSortBy: ({ invoice, shipper, vessel }) =>
      `${invoice?.billingCustomer?.customerName}-${vessel?.vesselCode}-${shipper?.shipperName}`.toLowerCase(),
    filterable: true,
    filterPanelProps: {
      customStyles: {
        width: 500,
      },
      customOptions: customerOptions || [],
      showSearch: true,
    },
    getValue: ({ invoice }) =>
      invoice ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/directory/customers/${invoice.billingCustomer?.id}`}
        >
          {invoice.billingCustomer?.customerName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{'-'}</ty.BodyText>
      ),
    rowKey: ({ vessel, shipper, invoice }) =>
      `${vessel?.vesselCode}-${shipper?.id}-${invoice?.orderId}`,
  },
  {
    key: 'invoice',
    label: 'Invoice Amt.',
    getValue: ({ invoice, shipper, vessel }) => {
      const totalAmount =
        invoice?.totalAmountsByVesselAndShipper?.nodes
          .find((value) => {
            const [vesselCode, shipperId] = value?.split(',') || [];
            return (
              vesselCode === vessel?.vesselCode && shipperId === shipper?.id
            );
          })
          ?.split(',')[2] || '0';
      const loading = !invoice?.totalAmountsByVesselAndShipper;
      return (
        <ty.BodyText textAlign={loading ? 'center' : 'right'}>
          {loading
            ? '...'
            : totalAmount && totalAmount !== '0'
            ? formatCurrency(parseFloat(totalAmount), true)
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'invoice',
    label: 'Credit',
    getValue: ({ invoice, shipper, vessel }) => {
      const totalCreditAmount =
        invoice?.totalAmountsByVesselAndShipper?.nodes
          .find((value) => {
            const [vesselCode, shipperId] = value?.split(',') || [];
            return (
              vesselCode === vessel?.vesselCode && shipperId === shipper?.id
            );
          })
          ?.split(',')[3] || '0';
      const hasCredit = totalCreditAmount && totalCreditAmount !== '0';
      const loading = !invoice?.totalAmountsByVesselAndShipper;
      return (
        <ty.BodyText
          color={
            invoice?.creditCode === '2' ? th.colors.status.errorAlt : undefined
          }
          textAlign={loading ? 'center' : 'right'}
          title={
            hasCredit
              ? invoice?.creditCode === '2'
                ? 'Due to product condition'
                : 'Due to market conditions'
              : undefined
          }
        >
          {loading
            ? '...'
            : hasCredit
            ? formatCurrency(parseFloat(totalCreditAmount), true)
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'invoice',
    label: 'Due',
    getValue: ({ invoice }) => {
      const isPaidInFull = invoice && isInvoicePaidInFull(invoice);
      const isUnpaid = invoice && isInvoiceUnpaid(invoice);
      const netAmountDue = parseFloat(invoice?.netAmountDue) || 0;
      const loading = invoice?.netAmountDue === undefined;
      return (
        <ty.BodyText textAlign={loading ? 'center' : 'right'}>
          {loading
            ? '...'
            : invoice && netAmountDue && !isPaidInFull && !isUnpaid
            ? formatCurrency(netAmountDue, true)
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'isApproved',
    label: 'Status',
    sortable: true,
    getValue: ({ isApproved, ...rest }) => (
      <l.Flex alignCenter>
        <div title="Urgent">
          <StatusIndicator selected={!!rest.isUrgent} status="warning" />
        </div>
        <l.Div width={th.spacing.sm} />
        {rest.invoice?.flag ? (
          <InfoPanel
            content={
              <>
                <l.Flex alignCenter mb={th.spacing.xs}>
                  <ty.CaptionText mr={th.spacing.md} secondary width={90}>
                    Alert status:
                  </ty.CaptionText>
                  <ty.BodyText>{rest.invoice?.flag || '-'}</ty.BodyText>
                </l.Flex>
                <l.Flex alignCenter>
                  <ty.CaptionText mr={th.spacing.md} secondary width={90}>
                    Condition code:
                  </ty.CaptionText>
                  <ty.BodyText>
                    {rest.invoice?.conditionCode || '-'}
                  </ty.BodyText>
                </l.Flex>
              </>
            }
            customStyles={{
              top: 18,
              width: 'auto',
            }}
            hover
            triggerIcon={
              <StatusIndicator
                onClick={() => {}}
                selected={!!rest.invoice?.flag}
                status="error"
              />
            }
            visible
          />
        ) : (
          <div title="Alert">
            <StatusIndicator selected={!!rest.invoice?.flag} status="error" />
          </div>
        )}
        <l.Div width={th.spacing.sm} />
        <div title="Click to approve/unapprove">
          <LineItemCheckbox
            checked={!!isApproved}
            onChange={() => {
              handleChange({ ...rest, isApproved: !isApproved });
            }}
          />
        </div>
      </l.Flex>
    ),
    allowOverflow: true,
  },
  {
    key: 'notes',
    label: 'Notes',
    getValue: ({ notes, ...rest }) => (
      <EditableCell
        content={{
          dirty: false,
          value: notes || '',
        }}
        defaultChildren={null}
        editing={true}
        inputProps={{
          width: th.sizes.fill,
        }}
        onChange={(e) => {
          handleChange({ ...rest, notes: e.target.value });
        }}
      />
    ),
  },
];

export const getSortedUnpaids = (unpaids: Unpaid[], showLiq: boolean) =>
  sortBy((unpaid) => {
    const key = `${unpaid.vessel?.vesselCode}-${unpaid.shipper?.shipperName}`;

    return !showLiq && unpaid.vesselControl?.isLiquidated
      ? `zzzzz ${key}`
      : unpaid.isUrgent &&
        !!unpaid.invoice?.flag &&
        (showLiq || !unpaid.isApproved)
      ? `000 0 ${key}`
      : unpaid.isUrgent && (showLiq || !unpaid.isApproved)
      ? `000 1 ${key}`
      : !!unpaid.invoice?.flag && (showLiq || !unpaid.isApproved)
      ? `000 2 ${key}`
      : showLiq || !unpaid.isApproved
      ? `${key}`
      : `zzzza ${key}`;
  }, unpaids);

export const emptyUnpaid = {
  isUrgent: false,
  isAlert: false,
  isApproved: false,
  notes: '',
};

export const vesselControlSearchText = ({
  shipper,
  unpaids,
  vessel,
}: VesselControl) => {
  const invoices = (unpaids?.nodes || []).map(
    (u) => u?.invoice,
  ) as InvoiceHeader[];
  return `${vessel?.vesselName} ${vessel?.vesselCode} ${shipper?.id} ${
    shipper?.shipperName
  } ${pluck('orderId', invoices).join(',')} ${pluck('invoiceId', invoices).join(
    ',',
  )} ${pluck('billingCustomer', invoices)
    .map((c) => c?.customerName)
    .join(',')} ${pluck('truckLoadId', invoices).join(',')}`.toLowerCase();
};

export const getUnpaidsInfo = (unpaids: Unpaid[]) =>
  unpaids.reduce(
    (acc, unpaid) => ({
      isAllUrgent: !!acc.isAllUrgent && !!unpaid.isUrgent,
      isAlert: !!acc.isAlert || !!unpaid.invoice?.flag,
      isAllApproved:
        !!acc.isAllApproved &&
        (!!unpaid.isApproved || unpaid.invoice?.paidCode === 'P'),
      isPartialApproved:
        !!acc.isPartialApproved ||
        !!unpaid.isApproved ||
        unpaid.invoice?.paidCode === 'P',
    }),
    {
      isAllUrgent: true,
      isAlert: false,
      isAllApproved: true,
      isPartialApproved: false,
    },
  );
