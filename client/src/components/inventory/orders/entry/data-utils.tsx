import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { OrderEntry, OrderEntryItem } from 'types';
import ty from 'ui/typography';

import { NewOrderEntry } from '.';

export type OrderEntryLabelInfo = LabelInfo<OrderEntry>;
export type NewOrderEntryLabelInfo = LabelInfo<NewOrderEntry>;
export type OrderEntryItemLabelInfo = LabelInfo<OrderEntryItem>;

export const listLabels: OrderEntryLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
  {
    key: 'orderDate',
    label: 'Order Date',
    isDate: true,
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'billingCustomerId',
    sortKey: 'billingCustomerId',
    label: 'Customer',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      customStyles: {
        width: 500,
      },
      queryProps: {
        query: CUSTOMER_DISTINCT_VALUES_QUERY,
        queryName: 'customerDistinctValues',
      },
      showSearch: true,
    },
    customSortBy: ({ billingCustomer }) =>
      billingCustomer?.customerName.toLowerCase(),
    getValue: ({ billingCustomer }) =>
      billingCustomer ? (
        <ty.BodyText>
          {billingCustomer.id} - {billingCustomer.customerName}
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'salesUserCode',
    label: 'Sales Assoc.',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      customStyles: {
        left: `-96px`,
      },
    },
    customSortBy: ({ salesUser }) => salesUser?.personContact?.firstName,
    getValue: ({ salesUser }) =>
      salesUser ? (
        <ty.BodyText>{salesUser.personContact?.firstName}</ty.BodyText>
      ) : (
        ''
      ),
  },
];

export const baseLabels: NewOrderEntryLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
];

export const itemListLabels: OrderEntryItemLabelInfo[] = [
  {
    key: 'lineId',
    label: 'Line',
  },
  {
    key: 'species',
    label: 'Species',
  },
  {
    key: 'variety',
    label: 'Variety',
  },
  {
    key: 'size',
    label: 'Size',
  },
  {
    key: 'packType',
    label: 'Pack Type',
  },
  {
    key: 'plu',
    label: 'PLU',
  },
  {
    key: 'label',
    label: 'Label',
  },
  {
    key: 'shipperId',
    label: 'Shipper',
  },
  {
    key: 'vesselCode',
    label: 'Vessel',
  },
  {
    key: 'locationId',
    label: 'Location',
  },
  {
    key: 'palletCount',
    label: 'Pallet Ct.',
  },
  {
    key: 'unitSellPrice',
    label: 'Unit Price',
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];
