import { format } from 'date-fns';

import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import { LabelInfo } from 'components/column-label';
import { getInventoryItemDescription } from 'components/inventory/inventory/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import { OrderItem } from 'types';
import ty from 'ui/typography';

export type OrderItemLabelInfo = LabelInfo<OrderItem>;

export const listLabels: (backOrderId?: string) => OrderItemLabelInfo[] = (
  backOrderId,
) => [
  ...(backOrderId
    ? []
    : ([
        {
          defaultSortOrder: SORT_ORDER.ASC,
          key: 'backOrderId',
          label: 'B/O ID',
          sortable: true,
          customSortBy: (data) =>
            data ? `${data.backOrderId} ${data.lineId}` : '',
        },
      ] as OrderItemLabelInfo[])),
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'lineId',
    label: 'Line ID',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'inventoryItem',
    sortKey: 'species',
    label: 'Species',
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      inventoryItem ? getInventoryItemDescription(inventoryItem) : '',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {inventoryItem.product?.species?.speciesDescription}
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    sortKey: 'variety',
    label: 'Variety',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {inventoryItem.product?.variety?.varietyDescription}
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    label: 'Size',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {inventoryItem.product?.sizes.nodes?.[0]?.combineDescription}
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    label: 'Pack Type',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {inventoryItem.product?.packType?.packDescription}
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    label: 'Label',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {inventoryItem.product?.packType?.label?.labelName}
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    label: 'Vessel',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>{inventoryItem.vessel?.vesselCode}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    label: 'Avail Date',
    getValue: ({ inventoryItem }) => {
      const dischargeDate = inventoryItem?.vessel?.dischargeDate;
      return dischargeDate ? (
        <ty.BodyText>
          {format(new Date(dischargeDate.replace(/-/g, '/')), 'M/dd')}
        </ty.BodyText>
      ) : (
        ''
      );
    },
  },
  {
    key: 'inventoryItem',
    label: 'Shipper',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>{inventoryItem.shipper?.shipperName}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'palletCount',
    label: 'Pallet Ct',
  },
  {
    key: 'boxCount',
    label: 'Box Ct',
  },
  {
    key: 'unitSellPrice',
    label: 'Unit Sell Price',
    getValue: ({ unitSellPrice }) =>
      unitSellPrice ? (
        <ty.BodyText>{`$${parseFloat(unitSellPrice).toFixed(2)}`}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'itemStatus',
    label: 'Status',
  },
];

export const indexListLabels: (
  selectedFilters: {
    [key: string]: string;
  },
  salesAssocOptions: string[],
) => OrderItemLabelInfo[] = (selectedFilters, salesAssocOptions = []) => [
  {
    key: 'orderId',
    label: 'Order ID',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'inventoryItem',
    sortKey: 'species',
    label: 'Species',
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      inventoryItem
        ? getInventoryItemDescription(inventoryItem, selectedFilters)
        : 'zzzzz',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {getInventoryItemDescription(inventoryItem, selectedFilters)}
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    sortKey: 'lot',
    label: 'Lot #',
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      inventoryItem ? inventoryItem.jvLotNumber : 'zzzzz',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>{inventoryItem.jvLotNumber}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'locationId',
    label: 'Loc',
    sortable: true,
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>{inventoryItem.warehouse?.id}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'order',
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
    customSortBy: ({ order }) =>
      order?.billingCustomer?.customerName.toLowerCase(),
    getValue: ({ order }) => {
      const { billingCustomer } = order || {};
      return billingCustomer ? (
        <ty.BodyText>{billingCustomer.customerName}</ty.BodyText>
      ) : (
        ''
      );
    },
  },
  {
    key: 'vesselCode',
    label: 'Disch Date',
    sortKey: 'dischargeDate',
    isDate: true,
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      inventoryItem
        ? new Date(inventoryItem.vessel?.dischargeDate.replace(/-/g, '/'))
        : 'zzzzz',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {inventoryItem.vessel?.dischargeDate.slice(5)}
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'order',
    label: 'Ship Date',
    sortKey: 'expectedShipDate',
    isDate: true,
    sortable: true,
    customSortBy: ({ order }) =>
      order ? new Date(order.expectedShipDate.replace(/-/g, '/')) : 'zzzzz',
    getValue: ({ order }) =>
      order ? <ty.BodyText>{order.expectedShipDate.slice(5)}</ty.BodyText> : '',
  },
  {
    key: 'palletCount',
    label: 'Plts',
    sortable: true,
    customSortBy: ({ palletCount }) => parseInt(palletCount, 10) || 0,
  },
  {
    key: 'unitSellPrice',
    label: 'Price',
    sortable: true,
    getValue: ({ unitSellPrice }) =>
      unitSellPrice ? (
        <ty.BodyText>{`$${parseFloat(unitSellPrice).toFixed(2)}`}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'order',
    label: 'Sls',
    sortKey: 'salesUserCode',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      customOptions: salesAssocOptions,
      customStyles: {
        left: '-124px',
        width: 200,
      },
    },
    customSortBy: ({ order }) => order?.salesUserCode || 'zzzzz',
    getValue: ({ order }) =>
      order ? <ty.BodyText>{order.salesUserCode}</ty.BodyText> : '',
  },
];

export const baseLabels: OrderItemLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
];
