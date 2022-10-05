import { format } from 'date-fns';

import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { ExpenseHeader, ExpenseItem } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';
import th from 'ui/theme';
import { formatCurrency } from 'utils/format';

export type ExpenseHeaderLabelInfo = LabelInfo<
  ExpenseHeader & { totalQuantity?: number }
>;
export type ExpenseItemLabelInfo = LabelInfo<ExpenseItem>;

export const indexListLabels: ExpenseHeaderLabelInfo[] = [
  {
    key: 'vesselCode',
    label: 'Vessel',
    sortable: true,
    customSortBy: ({ vessel }) => vessel?.vesselName,
    getValue: ({ vessel }) => (
      <ty.BodyText>
        {vessel ? `${vessel.vesselCode} - ${vessel.vesselName}` : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'vesselCode',
    label: 'Disch Date',
    sortable: true,
    customSortBy: ({ vessel }) =>
      vessel?.dischargeDate
        ? `${new Date(vessel.dischargeDate.replace(/-/g, '/')).getTime()} ${
            vessel?.vesselName
          }`
        : vessel?.vesselName,
    getValue: ({ vessel }) => (
      <ty.BodyText>
        {vessel
          ? format(new Date(vessel.dischargeDate.replace(/-/g, '/')), 'M/dd')
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'expenseCode',
    label: 'Expense Type',
    filterable: true,
    sortable: true,
  },
  {
    key: 'vendorId',
    label: 'Vendor',
    sortable: true,
    customSortBy: ({ vendor }) => vendor?.vendorName,
    getValue: ({ vendor }) => (
      <ty.BodyText>{vendor ? vendor.vendorName : '-'}</ty.BodyText>
    ),
  },
  {
    key: 'voucherId',
    label: 'Voucher Code',
    sortable: true,
  },
  {
    key: 'invoiceId',
    label: 'Invoice ID',
    sortable: true,
  },
  {
    key: 'paidCode',
    label: 'Paid Code',
    filterable: true,
    sortable: true,
    getValue: ({ paidCode }) => {
      const status = expenseStatusDescriptions[paidCode || 'X'];
      return (
        <l.Flex alignCenter justifyCenter>
          {status ? (
            <StatusIndicator
              color={status?.color}
              customStyles={{ wrapper: { py: th.spacing.tn } }}
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

export const listLabels: ExpenseHeaderLabelInfo[] = [
  {
    key: 'vendorId',
    label: 'Vendor',
    customSortBy: ({ vendor }) => vendor?.vendorName,
    getValue: ({ vendor }) =>
      vendor ? (
        <l.Flex alignCenter>
          <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
            {vendor.id}
          </ty.LinkText>
          <ty.BodyText ml={th.spacing.xs}>- {vendor.vendorName}</ty.BodyText>
        </l.Flex>
      ) : (
        ''
      ),
  },
  {
    key: 'invoiceId',
    label: 'Invoice ID',
  },
  {
    key: 'voucherId',
    label: 'Voucher Code',
  },
  {
    key: 'truckLoadId',
    label: 'Load ID',
    getValue: ({ truckLoadId }) =>
      truckLoadId ? (
        <ty.LinkText hover="false" to={`/inventory/truck-loads/${truckLoadId}`}>
          {truckLoadId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'isProrate',
    label: 'Prorate',
    getValue: ({ isProrate }) => (
      <ty.BodyText>{isProrate ? 'Yes' : 'No'}</ty.BodyText>
    ),
  },
  {
    key: 'totalQuantity',
    label: 'Quantity',
    getValue: ({ items }) => {
      const totalQuantity = ((items.nodes || []) as ExpenseItem[]).reduce(
        (acc, item) => acc + parseInt(item.quantity, 10),
        0,
      );
      return (
        <ty.BodyText mr={th.spacing.lg} textAlign="right">
          {totalQuantity}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'expenseAmount',
    label: 'Amount',
    getValue: ({ expenseAmount }) => (
      <ty.BodyText
        color={th.colors.brand.primaryAccent}
        mr={th.sizes.icon}
        textAlign="right"
      >
        {expenseAmount ? formatCurrency(parseFloat(expenseAmount)) : '-'}
      </ty.BodyText>
    ),
  },
];

export const itemListLabels: ExpenseItemLabelInfo[] = [
  {
    key: 'sequenceId',
    label: 'Seq ID',
    customSortBy: ({ sequenceId }) => parseInt(sequenceId, 10),
  },
  {
    key: 'palletId',
    label: 'Pallet ID',
    getValue: ({ palletId }) =>
      palletId ? (
        <ty.LinkText hover="false" to={`/inventory/pallets/${palletId}`}>
          {palletId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'productCode',
    label: 'Product Code',
  },
  {
    key: 'billOfLadingId',
    label: 'BOL ID',
  },
  {
    key: 'unitPrice',
    label: 'Unit Price',
    getValue: ({ itemAmount, quantity }) => {
      const price = itemAmount / parseInt(quantity, 10);
      return (
        <ty.BodyText mr={th.sizes.icon} textAlign="right">
          {price ? formatCurrency(price) : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'quantity',
    label: 'Quantity',
    getValue: ({ quantity }) => (
      <ty.BodyText mr={th.spacing.lg} textAlign="right">
        {quantity}
      </ty.BodyText>
    ),
  },
  {
    key: 'itemAmount',
    label: 'Amount',
    getValue: ({ itemAmount }) => (
      <ty.BodyText mr={th.sizes.icon} textAlign="right" width="95%">
        {itemAmount ? formatCurrency(parseFloat(itemAmount)) : '-'}
      </ty.BodyText>
    ),
  },
];

export const baseLabels: ExpenseHeaderLabelInfo[] = [];

export const expenseStatusDescriptions: {
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

export const expenseCodeDescriptions: {
  [key: string]: string;
} = {
  850: 'Interior Freight',
  860: 'Allowances Due Condition',
  901: 'Ocean Freight',
  902: 'Freight Guarantee',
  903: 'Bank Charges & Cables',
  904: 'Insurance',
  905: 'Duty',
  906: 'Customs Entry Charges',
  907: 'Pier Loading',
  908: 'Fumigation',
  909: 'Quarantine Inspection',
  910: 'USDA Inspections',
  911: 'Overtime',
  912: 'Interior Freight',
  913: 'Cartage',
  914: 'Warehousing-Storage',
  915: 'USA CBC Surcharge',
  916: 'Inspection',
  917: 'Repacking',
  918: 'Miscellaneous',
  919: 'Terminal Charges',
  920: 'Financing',
  921: 'Promotion',
  922: 'Dock Labor',
  923: 'Commission',
  924: 'Cost',
  925: 'Procurement',
  926: 'Heating',
  927: 'Handling',
  928: 'Stripping Containers',
  929: 'Restacking',
  930: 'Minimum Guarantee',
  931: 'Air Freight',
  932: 'Cold Treatment',
  933: 'HAPO Charges',
  934: 'Demurrage',
  935: 'Customs Inspections',
  936: 'Bagging',
  937: 'Remove Liners',
  938: 'Remove Liners/Add PLU',
  939: 'Add PLU',
  940: 'Add Lids to Boxes',
  941: 'Domestic Air Freight',
  942: 'Storage/Handling',
  943: 'Pre-Conditioning',
  944: 'Expenses Re-Export',
  945: 'Lab Sampling',
  946: 'Recooping',
  947: 'Comite Palta',
  948: 'Cartage/Storage/Handling',
  950: 'Dumping Charges',
  951: 'Bags',
  952: 'Boxes',
  953: 'Pre-cooling',
  955: 'Claim Expenses',
  956: 'Wharfage',
  957: 'Repack / Add PLU',
  961: 'Survey',
  962: 'RE_Palletizing',
  964: 'Strapping',
  965: 'Rebanding Pallets',
  966: 'Miscellaneous',
  967: 'Destination Charge',
};
