import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { ExpenseHeader, ExpenseItem } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';
import th from 'ui/theme';
import { formatCurrency } from 'utils/format';

export type ExpenseHeaderLabelInfo = LabelInfo<
  ExpenseHeader & { totalQuantity?: number }
>;
export type ExpenseItemLabelInfo = LabelInfo<ExpenseItem>;

export const listLabels: (shipperId: string) => ExpenseHeaderLabelInfo[] = (
  shipperId,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'vendorId',
    label: 'Vendor',
    sortable: true,
    customSortBy: ({ vendor, voucherId }) =>
      `${vendor?.vendorName} ${voucherId}`,
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
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'invoiceId',
    label: 'Invoice ID',
    sortable: true,
    customSortBy: ({ invoiceId }) => invoiceId || 'zzzzz',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'voucherId',
    label: 'Voucher Code',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'truckLoadId',
    label: 'Load ID',
    sortable: true,
    getValue: ({ truckLoadId }) =>
      truckLoadId && truckLoadId !== shipperId ? (
        <ty.LinkText hover="false" to={`/inventory/truck-loads/${truckLoadId}`}>
          {truckLoadId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'isProrate',
    label: 'Prorate?',
    sortable: true,
    getValue: ({ isProrate }) => (
      <ty.BodyText>{isProrate ? 'Yes' : '-'}</ty.BodyText>
    ),
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'isEstimated',
    label: 'Est?',
    sortable: true,
    getValue: ({ isEstimated }) => (
      <ty.BodyText>{isEstimated ? 'Yes' : '-'}</ty.BodyText>
    ),
  },
  {
    key: 'paidCode',
    label: 'Paid?',
    sortable: true,
    getValue: ({ expenseCode, paidCode, vendorId }) => {
      const status =
        expenseCode &&
        !alwaysPaidExpenseCodes.includes(expenseCode) &&
        vendorId &&
        !alwaysPaidVendorIds.includes(vendorId) &&
        expenseStatusDescriptions[paidCode || 'X'];
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
            <ty.BodyText center>-</ty.BodyText>
          )}
        </l.Flex>
      );
    },
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'expenseAmount',
    label: 'Avg Price',
    sortable: true,
    sortKey: 'avgPrice',
    customSortBy: ({ items }) => {
      const { expenseAmount, totalQuantity } = (
        (items?.nodes || []) as ExpenseItem[]
      ).reduce(
        (acc, item) => ({
          expenseAmount: acc.expenseAmount + parseInt(item.itemAmount, 10),
          totalQuantity: acc.totalQuantity + parseInt(item.quantity, 10),
        }),
        { expenseAmount: 0, totalQuantity: 0 },
      );
      return expenseAmount / (totalQuantity || 1);
    },
    getValue: ({ items }) => {
      const { expenseAmount, totalQuantity } = (
        (items?.nodes || []) as ExpenseItem[]
      ).reduce(
        (acc, item) => ({
          expenseAmount: acc.expenseAmount + parseInt(item.itemAmount, 10),
          totalQuantity: acc.totalQuantity + parseInt(item.quantity, 10),
        }),
        { expenseAmount: 0, totalQuantity: 0 },
      );
      const avgPrice = expenseAmount / (totalQuantity || 1);
      return (
        <ty.BodyText mr={th.spacing.md} textAlign="right">
          {avgPrice ? formatCurrency(avgPrice) : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'totalQuantity',
    label: 'Quantity',
    sortable: true,
    customSortBy: ({ items }) =>
      ((items?.nodes || []) as ExpenseItem[]).reduce(
        (acc, item) => acc + parseInt(item.quantity, 10),
        0,
      ),
    getValue: ({ items }) => {
      const totalQuantity = ((items?.nodes || []) as ExpenseItem[]).reduce(
        (acc, item) => acc + parseInt(item.quantity, 10),
        0,
      );
      return (
        <ty.BodyText mr={th.spacing.md} textAlign="right">
          {totalQuantity ? totalQuantity.toLocaleString() : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'expenseAmount',
    label: 'Amount',
    sortable: true,
    customSortBy: ({ items }) =>
      ((items?.nodes || []) as ExpenseItem[]).reduce(
        (acc, item) => acc + parseFloat(item.itemAmount),
        0,
      ),
    getValue: ({ items }) => {
      const expenseAmount = ((items?.nodes || []) as ExpenseItem[]).reduce(
        (acc, item) => acc + parseFloat(item.itemAmount),
        0,
      );
      return (
        <ty.BodyText
          color={th.colors.brand.primaryAccent}
          mr={th.spacing.md}
          textAlign="right"
        >
          {expenseAmount ? formatCurrency(expenseAmount) : '-'}
        </ty.BodyText>
      );
    },
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
    getValue: ({ pallet }) =>
      pallet ? (
        <ty.LinkText hover="false" to={`/inventory/pallets/${pallet.palletId}`}>
          {pallet.palletId}
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
        {quantity.toLocaleString()}
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
  A: {
    color: th.colors.status.success,
    text: 'APP',
    title: 'All expenses approved',
  },
  P: {
    color: th.colors.status.successAlt,
    text: 'PAID',
    title: 'Paid in full',
  },
  R: {
    color: th.colors.status.warning,
    text: 'REV',
    title: 'Some or all expenses in review',
  },
  X: {
    color: th.colors.status.warning,
    text: 'UNP',
    title: 'Unpaid or partially paid',
  },
};

export const alwaysPaidExpenseCodes = ['860', '920', '923', '925'];
export const alwaysPaidVendorIds = ['09960'];

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
