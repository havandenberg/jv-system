import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { TruckLoad } from 'types';
import ty from 'ui/typography';
import { formatTime } from 'utils/date';

export type TruckLoadLabelInfo = LabelInfo<TruckLoad>;

export const indexListLabels: TruckLoadLabelInfo[] = [
  {
    key: 'loadId',
    label: 'Load ID',
    sortable: true,
  },
  {
    key: 'shipDate',
    label: 'Ship Date',
    sortable: true,
  },
  {
    key: 'vendorId',
    label: 'Vendor',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'warehouseId',
    label: 'Warehouse',
    sortable: true,
    filterable: true,
    customSortBy: ({ warehouse }) =>
      warehouse?.warehouseName.toLowerCase() || '',
    getValue: ({ warehouse }) =>
      warehouse ? <ty.BodyText>{warehouse.warehouseName}</ty.BodyText> : '',
  },
  {
    key: 'fob',
    label: 'FOB / Del',
    sortable: true,
    getValue: ({ fob }) => (
      <ty.BodyText>{fob ? 'FOB' : 'Delivery'}</ty.BodyText>
    ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'loadStatus',
    label: 'Status',
    sortable: true,
  },
];

export const listLabels: TruckLoadLabelInfo[] = [
  {
    key: 'shipDate',
    label: 'Ship Date',
    sortable: true,
  },
  {
    key: 'vendorId',
    label: 'Vendor',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'warehouseId',
    label: 'Warehouse',
    sortable: true,
    filterable: true,
    customSortBy: ({ warehouse }) =>
      warehouse?.warehouseName.toLowerCase() || '',
    getValue: ({ warehouse }) =>
      warehouse ? <ty.BodyText>{warehouse.warehouseName}</ty.BodyText> : '',
  },
  {
    key: 'fob',
    label: 'FOB / Del',
    sortable: true,
    getValue: ({ fob }) => (
      <ty.BodyText>{fob ? 'FOB' : 'Delivery'}</ty.BodyText>
    ),
  },
  {
    key: 'changeFlag',
    label: 'Change Flag',
  },
  {
    key: 'inUse',
    label: 'In Use',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'loadStatus',
    label: 'Status',
    sortable: true,
  },
];

export const indexBaseLabels: TruckLoadLabelInfo[] = [
  {
    key: 'loadId',
    label: 'Load ID',
  },
  {
    key: 'shipDate',
    label: 'Ship Date',
  },
  {
    key: 'truckerName',
    label: 'Trucker Name',
  },
  {
    key: 'ryanNumber',
    label: 'Ryan Number',
  },
  {
    key: 'licensePlate',
    label: 'License Plate',
  },
  {
    key: 'temperature',
    label: 'Temperature',
  },
  {
    key: 'loadLock',
    label: 'Load Lock',
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];

export const baseLabels: TruckLoadLabelInfo[] = [
  {
    key: 'orderMasters',
    label: 'Order ID',
    getValue: ({ loadId, orderMasters, warehouse }) => {
      const orderMaster = orderMasters?.nodes?.find(
        (orderMaster) =>
          orderMaster?.shipWarehouse?.id === warehouse?.id &&
          orderMaster?.truckLoadId === loadId,
      );
      return orderMaster ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/orders/${orderMaster.orderId}?backOrderId=${orderMaster.backOrderId}`}
        >
          {orderMaster.orderId} ({orderMaster.backOrderId})
        </ty.LinkText>
      ) : (
        ''
      );
    },
  },
  {
    key: 'shipDate',
    label: 'Ship Date',
  },
  {
    key: 'warehouseId',
    label: 'Warehouse',
    getValue: ({ warehouse }) =>
      warehouse ? (
        <ty.LinkText
          hover="false"
          to={`/directory/warehouses/${warehouse?.id}`}
        >
          {warehouse.id} - {warehouse.warehouseName}
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
    key: 'expeditorName',
    label: 'Expeditor',
  },
  {
    key: 'timeIn',
    label: 'Time In',
    getValue: ({ timeIn }) => (
      <ty.BodyText>{timeIn ? formatTime(new Date(timeIn)) : '-'}</ty.BodyText>
    ),
  },
  {
    key: 'timeConfirmed',
    label: 'Time Confirmed',
    getValue: ({ timeConfirmed }) => (
      <ty.BodyText>
        {timeConfirmed ? formatTime(new Date(timeConfirmed)) : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'timeStarted',
    label: 'Time Started',
    getValue: ({ timeStarted }) => (
      <ty.BodyText>
        {timeStarted ? formatTime(new Date(timeStarted)) : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'timeCompleted',
    label: 'Time Completed',
    getValue: ({ timeCompleted }) => (
      <ty.BodyText>
        {timeCompleted ? formatTime(new Date(timeCompleted)) : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'timeOut',
    label: 'Time Out',
    getValue: ({ timeOut }) => (
      <ty.BodyText>{timeOut ? formatTime(new Date(timeOut)) : '-'}</ty.BodyText>
    ),
  },
  {
    key: 'loadStatus',
    label: 'Status',
  },
  {
    key: 'fob',
    label: 'FOB / Del',
    getValue: ({ fob }) => (
      <ty.BodyText>{fob ? 'FOB' : 'Delivery'}</ty.BodyText>
    ),
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];
