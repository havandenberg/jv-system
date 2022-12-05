import { LabelInfo } from 'components/column-label';
import EditableCell from 'components/editable-cell';
import InfoPanel from 'components/info-panel';
import StatusIndicator from 'components/status-indicator';
import { differenceInDays } from 'date-fns';
import { groupBy, sortBy } from 'ramda';
import { Pallet, Unpaid, Vessel } from 'types';
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

export const getSortedUnpaids = (unpaids: Unpaid[]) =>
  sortBy((unpaid) => {
    const key = `${unpaid.vessel?.vesselCode}-${unpaid.shipper?.shipperName}`;

    return unpaid.vesselControl?.isLiquidated
      ? `zzzzz ${key}`
      : unpaid.isUrgent && !!unpaid.invoice?.flag && !unpaid.isApproved
      ? `000 0 ${key}`
      : unpaid.isUrgent && !unpaid.isApproved
      ? `000 1 ${key}`
      : !!unpaid.invoice?.flag && !unpaid.isApproved
      ? `000 2 ${key}`
      : !unpaid.isApproved
      ? `${key}`
      : `zzzza ${key}`;
  }, unpaids);

export const emptyUnpaid = {
  isUrgent: false,
  isAlert: false,
  isApproved: false,
  notes: '',
};

export const palletSearchText = (pallet: Pallet, vessel: Vessel) =>
  `${vessel?.vesselName} ${vessel?.vesselCode} ${pallet.shipper?.id} ${pallet.shipper?.shipperName} ${pallet.invoiceHeader?.invoiceId} ${pallet.invoiceHeader?.billingCustomer?.customerName} ${pallet.invoiceHeader?.truckLoadId}`.toLowerCase();

export const buildUnpaidItems = (
  vessels: Vessel[],
  unpaids: Unpaid[],
  salesUserCode?: string | null,
  searchArray?: string[],
) =>
  vessels
    .map((vessel) => {
      const vesselPallets = (vessel.pallets?.nodes || []) as Pallet[];
      const palletsGroupedByVesselShipper = groupBy(
        ({ invoiceHeader, shipper }) =>
          `${shipper?.id}-${invoiceHeader?.invoiceId}` || 'UNK',
        vesselPallets.filter((p) => {
          const searchText = palletSearchText(p, vessel);
          return (
            (!salesUserCode ||
              salesUserCode === 'all' ||
              p.invoiceHeader?.salesUserCode === salesUserCode) &&
            (!searchArray ||
              searchArray.every((searchVal) =>
                searchText.includes(searchVal.toLowerCase()),
              ))
          );
        }),
      );
      return Object.values(palletsGroupedByVesselShipper).map(
        (vesselShipperPallets) => {
          const shipper = vesselShipperPallets[0].shipper;
          const invoice = vesselShipperPallets[0].invoiceHeader;
          const unpaid =
            unpaids.find(
              (u) =>
                u.vessel?.vesselCode === vessel.vesselCode &&
                u.shipper?.id === shipper?.id &&
                u.invoice?.invoiceId === invoice?.invoiceId,
            ) || emptyUnpaid;

          return {
            vessel,
            shipper,
            invoice,
            vesselCode: vessel.vesselCode,
            shipperId: shipper?.id,
            invoiceId: invoice?.invoiceId,
            orderId: invoice?.orderId,
            ...unpaid,
          };
        },
      );
    })
    .flat() as Unpaid[];

export const getUnpaidsInfo = (unpaids: Unpaid[]) =>
  unpaids.reduce(
    (acc, unpaid) => ({
      isAllUrgent: !!acc.isAllUrgent && !!unpaid.isUrgent,
      isAlert: !!acc.isAlert || !!unpaid.invoice?.flag,
      isAllApproved: !!acc.isAllApproved && !!unpaid.isApproved,
      isPartialApproved: !!acc.isPartialApproved || !!unpaid.isApproved,
    }),
    {
      isAllUrgent: true,
      isAlert: false,
      isAllApproved: true,
      isPartialApproved: false,
    },
  );
