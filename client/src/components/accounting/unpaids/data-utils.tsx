import { LabelInfo } from 'components/column-label';
import EditableCell from 'components/editable-cell';
import InfoPanel from 'components/info-panel';
import StatusIndicator from 'components/status-indicator';
import { differenceInDays } from 'date-fns';
import { pluck, sortBy } from 'ramda';
import { InvoiceHeader, Pallet, Shipper, Unpaid, Vessel } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatShortDate } from 'utils/date';
import { formatCurrency } from 'utils/format';

export type UnpaidLabelInfo = LabelInfo<Unpaid>;

export const listLabels: (
  handleChange: (updatedItem: Unpaid) => void,
) => UnpaidLabelInfo[] = (handleChange) => [
  {
    key: 'vessel',
    label: 'Vessel',
    getValue: ({ vessel }) =>
      vessel ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/inventory/vessels/${vessel.vesselCode}`}
        >
          {vessel.vesselCode}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{'-'}</ty.BodyText>
      ),
  },
  {
    key: 'shipper',
    label: 'Shipper',
    getValue: ({ shipper }) =>
      shipper ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/directory/shipper/${shipper.id}`}
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
    key: 'invoice',
    label: 'Load #',
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
    key: 'invoice',
    label: 'Invoice #',
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
    key: 'invoice',
    label: 'Ship Date',
    getValue: ({ invoice }) => (
      <ty.BodyText>
        {invoice?.actualShipDate
          ? formatShortDate(new Date(invoice.actualShipDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'invoice',
    label: 'Days',
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
    key: 'invoice',
    label: 'Ship To',
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
    getValue: ({ invoice }) => (
      <ty.BodyText pr={th.spacing.sm} textAlign="right">
        {invoice?.totalAmount && invoice?.totalAmount !== '0'
          ? formatCurrency(parseFloat(invoice?.totalAmount), true)
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'invoice',
    label: 'Credit',
    getValue: ({ invoice }) => (
      <ty.BodyText
        textAlign="right"
        pr={th.spacing.sm}
        color={
          invoice?.creditCode === '2' ? th.colors.status.errorAlt : undefined
        }
      >
        {invoice?.totalCreditAmount && invoice?.totalCreditAmount !== '0'
          ? formatCurrency(parseFloat(invoice?.totalCreditAmount), true)
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'invoice',
    label: 'Due',
    getValue: ({ invoice }) => (
      <ty.BodyText pr={th.spacing.sm} textAlign="right">
        {invoice?.amountOwed && invoice?.amountOwed !== '0'
          ? formatCurrency(parseFloat(invoice?.amountOwed), true)
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'isApproved',
    label: 'Status',
    sortable: true,
    getValue: ({ isApproved, ...rest }) => (
      <l.Flex alignCenter>
        <StatusIndicator selected={!!rest.isUrgent} status="warning" />
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
          <StatusIndicator selected={!!rest.invoice?.flag} status="error" />
        )}
        <l.Div width={th.spacing.sm} />
        <LineItemCheckbox
          checked={!!isApproved}
          onChange={() => {
            handleChange({ ...rest, isApproved: !isApproved });
          }}
        />
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

export const palletSearchText = (
  pallet: Pallet,
  vessel: Vessel,
  shipper: Shipper,
) =>
  `${vessel?.vesselName} ${vessel?.vesselCode} ${shipper?.id} ${
    shipper?.shipperName
  } ${pluck(
    'orderId',
    (pallet.invoiceHeaders.nodes || []) as InvoiceHeader[],
  ).join(',')} ${pluck(
    'invoiceId',
    (pallet.invoiceHeaders.nodes || []) as InvoiceHeader[],
  ).join(',')} ${pluck(
    'billingCustomer',
    (pallet.invoiceHeaders.nodes || []) as InvoiceHeader[],
  )
    .map((c) => c?.customerName)
    .join(',')} ${pluck(
    'truckLoadId',
    (pallet.invoiceHeaders.nodes || []) as InvoiceHeader[],
  ).join(',')}`.toLowerCase();

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
