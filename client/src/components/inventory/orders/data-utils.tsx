import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { pluck, sortBy, uniq } from 'ramda';
import { OrderItem, OrderMaster, ProductMaster } from 'types';
import ty from 'ui/typography';

export type OrderMasterLabelInfo = LabelInfo<OrderMaster>;

export const indexListLabels: OrderMasterLabelInfo[] = [
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

export const listLabels: OrderMasterLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'backOrderId',
    label: 'B/O ID',
    sortable: true,
  },
  {
    key: 'truckLoadId',
    label: 'Truck Load ID',
    getValue: ({ truckLoad }) =>
      truckLoad ? <ty.BodyText>{truckLoad?.loadId}</ty.BodyText> : '',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'expectedShipDate',
    label: 'Ship Date',
    isDate: true,
    sortable: true,
  },
  {
    key: 'shipWarehouseId',
    label: 'Ship Location',
    getValue: ({ shipWarehouse }) =>
      shipWarehouse ? (
        <ty.BodyText>{shipWarehouse.warehouseName}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'id',
    label: 'Summary',
    getValue: ({ items }) => {
      const orderItems = (items.nodes || []) as OrderItem[];
      const products = orderItems.map(
        ({ inventoryItem }) => inventoryItem?.product,
      ) as ProductMaster[];
      const speciesList = uniq(pluck('species', products));
      return speciesList
        .map(
          (species) =>
            `${species?.speciesDescription?.slice(0, 3) || '?'}. (${orderItems
              .filter(
                (orderItem) =>
                  orderItem?.inventoryItem?.product?.species === species,
              )
              .reduce(
                (acc, item) => acc + parseInt(item?.palletCount, 10) || 0,
                0,
              )})`,
        )
        .join(', ');
    },
  },
  {
    key: 'orderStatus',
    label: 'Status',
    sortable: true,
  },
];

export const indexBaseLabels: OrderMasterLabelInfo[] = [
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
];

export const baseLabels: OrderMasterLabelInfo[] = [
  {
    key: 'backOrderId',
    label: 'Back Order ID',
  },
  {
    key: 'expectedShipDate',
    label: 'Ship Date',
    isDate: true,
  },
  {
    key: 'shipWarehouseId',
    label: 'Warehouse',
    getValue: ({ shipWarehouse }) =>
      shipWarehouse ? (
        <ty.LinkText
          hover="false"
          to={`/directory/warehouses/${shipWarehouse.id}`}
        >
          {shipWarehouse.id} - {shipWarehouse.warehouseName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'vendorId',
    label: 'Vendor',
  },
  {
    key: 'id',
    label: 'Summary',
    getValue: ({ items }) => {
      const orderItems = (items?.nodes || []) as OrderItem[];
      const products = orderItems.map(
        ({ inventoryItem }) => inventoryItem?.product,
      ) as ProductMaster[];
      const speciesList = uniq(pluck('species', products));
      return (
        <ty.BodyText>
          {speciesList
            .map(
              (species) =>
                `${
                  species?.speciesDescription?.slice(0, 3) || '?'
                }. (${orderItems
                  .filter(
                    (orderItem) =>
                      orderItem?.inventoryItem?.product?.species === species,
                  )
                  .reduce(
                    (acc, item) => acc + parseInt(item?.palletCount, 10) || 0,
                    0,
                  )})`,
            )
            .join(', ')}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'truckLoadId',
    label: 'Truck Load',
    getValue: ({ shipWarehouse, truckLoad }) =>
      truckLoad ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/truck-loads/${truckLoad.loadId}?location=${shipWarehouse?.id}`}
        >
          {truckLoad.loadId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'loadStatus',
    label: 'Load Status',
  },
  {
    key: 'deliveryZone',
    label: 'Delivery Zone',
  },
  {
    key: 'registerNumber',
    label: 'Register Number',
  },
  {
    key: 'paidCode',
    label: 'Paid Code',
  },
  {
    key: 'orderStatus',
    label: 'Status',
  },
];

export const getSortedItems = <T extends {}>(
  listLabels: LabelInfo<T>[],
  items: T[],
  sortKey: string,
  sortOrder: string,
) => {
  const activeLabel = listLabels.find(
    (label) => (label.sortKey || label.key) === sortKey,
  );
  const sortByFunc =
    activeLabel &&
    (activeLabel.customSortBy ||
      ((item: T) => item[(activeLabel.sortKey || activeLabel.key) as keyof T]));

  return sortKey && sortByFunc
    ? sortOrder === SORT_ORDER.DESC
      ? sortBy(sortByFunc, items).reverse()
      : sortBy(sortByFunc, items)
    : items;
};
