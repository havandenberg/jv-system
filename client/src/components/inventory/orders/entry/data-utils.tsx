import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { groupBy, values } from 'ramda';
import { OrderEntry, OrderEntryItem } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';

import { NewOrderEntry } from '.';

export type OrderEntryLabelInfo = LabelInfo<OrderEntry>;
export type NewOrderEntryLabelInfo = LabelInfo<NewOrderEntry>;
export type OrderEntryItemLabelInfo = LabelInfo<OrderEntryItem>;

export const listLabels: OrderEntryLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
    sortable: true,
  },
  {
    key: 'truckLoadId',
    label: 'Load ID',
    sortable: true,
  },
  {
    key: 'customerPo',
    label: 'PO Number',
    sortable: true,
  },
  {
    key: 'orderDate',
    label: 'Order Date',
    isDate: true,
    sortable: true,
  },
  {
    key: 'fobDate',
    label: 'FOB Date',
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
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'reviewUserCode',
    label: 'Status',
    sortable: true,
    customSortBy: ({ fobDate, reviewUserCode }) =>
      `${!reviewUserCode ? 'a' : 'b'} ${new Date(
        fobDate.replace(/-/g, '/'),
      ).getTime()}`,
    getValue: ({ reviewUserCode }) => (
      <l.Flex alignCenter justifyCenter>
        <StatusIndicator status={reviewUserCode ? 'success' : 'warning'} />
      </l.Flex>
    ),
  },
];

export const baseLabels: OrderEntryLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
  {
    key: 'orderDate',
    label: 'Order Date',
    isDate: true,
  },
  {
    key: 'fobDate',
    label: 'FOB Date',
    isDate: true,
  },
  {
    key: 'deliveredDate',
    label: 'Delivered Date',
    isDate: true,
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
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'reviewUserCode',
    label: 'Status',
    sortable: true,
    customSortBy: ({ fobDate, reviewUserCode }) =>
      `${!reviewUserCode ? 'a' : 'b'} ${new Date(
        fobDate.replace(/-/g, '/'),
      ).getTime()}`,
    getValue: ({ reviewUserCode }) => (
      <l.Flex alignCenter justifyCenter>
        <StatusIndicator status={reviewUserCode ? 'success' : 'warning'} />
      </l.Flex>
    ),
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
    validate: ({ species }) => species !== '',
  },
  {
    key: 'variety',
    label: 'Variety',
    validate: ({ variety }) => variety !== '',
  },
  {
    key: 'size',
    label: 'Size',
    validate: ({ size }) => size !== '',
  },
  {
    key: 'packType',
    label: 'Pack Type',
    validate: ({ packType }) => packType !== '',
  },
  {
    key: 'plu',
    label: 'PLU',
    validate: ({ plu }) => plu !== '',
  },
  {
    key: 'label',
    label: 'Label',
    validate: ({ label }) => label !== '',
  },
  {
    key: 'shipperId',
    label: 'Shipper',
    validate: ({ shipperId }) => shipperId !== '',
  },
  {
    key: 'vesselCode',
    label: 'Vessel',
    validate: ({ vesselCode }) => vesselCode !== '',
  },
  {
    key: 'locationId',
    label: 'Location',
    validate: ({ locationId }) => locationId !== '',
  },
  {
    key: 'palletCount',
    label: 'Pallet Ct.',
    validate: ({ palletCount }) => parseInt(palletCount, 10) > 0,
  },
  {
    key: 'unitSellPrice',
    label: 'Unit Price',
    validate: ({ unitSellPrice }) => parseFloat(unitSellPrice) > 0,
  },
  {
    key: 'deliveryCharge',
    label: 'Freight',
    validate: ({ deliveryCharge }) => parseFloat(deliveryCharge) > 0,
  },
];

export const getDuplicateOrderEntryItemIds = (items: OrderEntryItem[]) =>
  values(
    groupBy(
      (item) =>
        `species=${item.species}variety=${item.variety}size=${item.size}packType=${item.packType}plu=${item.plu}label=${item.label}shipperId=${item.shipperId}vesselCode=${item.vesselCode}locationId=${item.locationId}`,
      items,
    ),
  )
    .filter((duplicateItems) => duplicateItems.length > 1)
    .map((duplicateItems) => duplicateItems.map((p) => parseInt(p.id, 10)))
    .flat();
