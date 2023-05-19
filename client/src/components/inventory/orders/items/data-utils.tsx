import { format } from 'date-fns';

import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import { LabelInfo } from 'components/column-label';
import { getInventoryItemDescription } from 'components/inventory/inventory/utils';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { OrderItem } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';
import { formatCurrency } from 'utils/format';

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
    customSortBy: (data) => (data ? parseInt(data.lineId, 10) : ''),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'inventoryItem',
    sortKey: 'species',
    label: 'Species',
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      inventoryItem
        ? getInventoryItemDescription(inventoryItem).description
        : '',
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
          {inventoryItem.sizes.nodes?.[0]?.combineDescription}
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
        <ty.BodyText>{inventoryItem.packType?.packDescription}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    label: 'Label',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>{inventoryItem.packType?.label?.labelName}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    label: 'Vessel',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/vessels/${inventoryItem.vessel?.vesselCode}?isPre=${
            inventoryItem.vessel?.isPre ? 1 : 0
          }`}
        >
          {inventoryItem.vessel?.vesselCode}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
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
        <ty.LinkText
          hover="false"
          to={`/directory/shippers/${inventoryItem.shipper?.id}`}
        >
          {inventoryItem.shipper?.shipperName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
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
        <ty.BodyText>{formatCurrency(parseFloat(unitSellPrice))}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'specialLotNumber',
    label: 'Repack',
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
    label: 'Description',
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      inventoryItem
        ? getInventoryItemDescription(inventoryItem, selectedFilters)
            .description
        : 'zzzzz',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <l.Grid
          alignCenter
          gridTemplateColumns="1fr 1fr 0.6fr repeat(3, 0.7fr)"
        >
          {getInventoryItemDescription(
            inventoryItem,
            selectedFilters,
          ).descriptionItems.map((description) => (
            <ty.BodyText ellipsis>{description}</ty.BodyText>
          ))}
        </l.Grid>
      ) : (
        ''
      ),
  },
  {
    key: 'inventoryItem',
    sortKey: 'lot',
    label: 'Lot #',
    sortable: true,
    customSortBy: (orderItem) =>
      orderItem ? getOrderItemLotNumber(orderItem) : 'zzzzz',
    getValue: (orderItem) =>
      orderItem ? (
        <ty.BodyText>{getOrderItemLotNumber(orderItem)}</ty.BodyText>
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
      portalId: 'order-items-portal',
      portalTop: -4,
      portalLeft: 690,
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
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'order',
    sortKey: 'billingCustomerCity',
    label: 'City',
    sortable: true,
    customSortBy: ({ order }) => order?.billingCustomer?.city?.toLowerCase(),
    getValue: ({ order }) => {
      const { billingCustomer } = order || {};
      return billingCustomer ? (
        <ty.BodyText>{billingCustomer.city}</ty.BodyText>
      ) : (
        ''
      );
    },
  },
  {
    key: 'palletCount',
    label: 'Plts',
    sortable: true,
    customSortBy: ({ palletCount }) => parseInt(palletCount, 10) || 0,
  },
  {
    key: 'unitSellPrice',
    label: 'FOB Price',
    sortable: true,
    getValue: ({ unitSellPrice }) =>
      unitSellPrice ? (
        <ty.BodyText>{formatCurrency(parseFloat(unitSellPrice))}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'order',
    sortKey: 'customerPo',
    label: 'PO',
    sortable: true,
    customSortBy: ({ order }) => order?.customerPo,
    getValue: ({ order }) => {
      return <ty.BodyText>{order?.customerPo || '-'}</ty.BodyText>;
    },
  },
  {
    key: 'order',
    label: 'Load #',
    sortable: true,
    customSortBy: ({ order }) => order?.truckLoadId,
    getValue: ({ order }) => (
      <ty.BodyText>{order?.truckLoadId || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'order',
    label: 'Ship Date',
    sortKey: 'actualShipDate',
    isDate: true,
    sortable: true,
    customSortBy: ({ order }) =>
      order?.actualShipDate
        ? new Date(order.actualShipDate.replace(/-/g, '/'))
        : 'zzzzz',
    getValue: ({ order }) =>
      order?.actualShipDate ? (
        <ty.BodyText>{order.actualShipDate.slice(5)}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'order',
    label: 'Del Date',
    sortKey: 'expectedShipDate',
    isDate: true,
    sortable: true,
    customSortBy: ({ order }) =>
      order?.expectedShipDate
        ? new Date(order.expectedShipDate.replace(/-/g, '/'))
        : 'zzzzz',
    getValue: ({ order }) =>
      order?.expectedShipDate ? (
        <ty.BodyText>{order.expectedShipDate.slice(5)}</ty.BodyText>
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
        width: 180,
      },
      portalId: 'order-items-portal',
      portalTop: -4,
      portalLeft: 1440,
    },
    customSortBy: ({ order }) => order?.salesUserCode || 'zzzzz',
    getValue: ({ order }) =>
      order ? <ty.BodyText>{order.salesUserCode}</ty.BodyText> : '',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'vesselCode',
    label: 'Code',
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      inventoryItem ? inventoryItem.vessel?.vesselCode : 'zzzzz',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>{inventoryItem.vessel?.vesselCode}</ty.BodyText>
      ) : (
        ''
      ),
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
    key: 'vesselCode',
    label: 'P',
    sortKey: 'isPre',
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      !!inventoryItem?.vessel?.isPre
        ? inventoryItem.vessel?.vesselCode
        : 'zzzzz',
    getValue: ({ inventoryItem }) =>
      !!inventoryItem?.vessel?.isPre ? (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator status="warning" />
        </l.Flex>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
];

export const baseLabels: OrderItemLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
];

export const getOrderItemLotNumber = (orderItem: OrderItem) =>
  `${orderItem.jvLotNumber?.[0] || '0'}${orderItem.specialLotNumber || '00'}${
    orderItem.jvLotNumber?.[3] || '0'
  }${orderItem.jvLotNumber?.[4] || '0'}`;
