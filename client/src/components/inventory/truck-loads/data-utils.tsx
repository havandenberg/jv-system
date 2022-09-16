import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { TruckLoad } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';
import th from 'ui/theme';
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
    customSortBy: ({ changeFlag, loadStatus, shipDate }) =>
      `${changeFlag ? 0 : loadStatus} ${new Date(
        shipDate.replace(/-/g, '/'),
      ).getTime()}`,
    getValue: ({ changeFlag, loadStatus }) => {
      const status =
        truckLoadStatusDescriptions[changeFlag ? 'changed' : loadStatus || ''];
      return (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator
            color={status?.color}
            customStyles={{
              wrapper: {
                py: th.spacing.tn,
              },
            }}
            text={status?.text}
            title={status?.title || loadStatus || ''}
          />
        </l.Flex>
      );
    },
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
    customSortBy: ({ changeFlag, loadStatus, shipDate }) =>
      `${changeFlag ? 0 : loadStatus} ${new Date(
        shipDate.replace(/-/g, '/'),
      ).getTime()}`,
    getValue: ({ changeFlag, loadStatus }) => {
      const status =
        truckLoadStatusDescriptions[changeFlag ? 'changed' : loadStatus || ''];
      return (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator
            color={status?.color}
            customStyles={{
              wrapper: {
                py: th.spacing.tn,
              },
            }}
            text={status?.text}
            title={status?.title || loadStatus || ''}
          />
        </l.Flex>
      );
    },
  },
];

export const indexBaseLabels: (location?: string) => TruckLoadLabelInfo[] = (
  location,
) => [
  {
    key: 'loadId',
    label: 'Load ID',
  },
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
          to={`/inventory/orders/${orderMaster.orderId}?orderView=${
            location ? 'orderItems' : 'pickupLocations'
          }${location ? `&backOrderId=${orderMaster.backOrderId}` : ''}`}
        >
          {orderMaster.orderId}
        </ty.LinkText>
      ) : (
        ''
      );
    },
  },
  {
    key: 'truckerName',
    label: 'Trucker Name',
  },
  {
    key: 'licensePlate',
    label: 'License Plate',
  },
  {
    key: 'fob',
    label: 'FOB / Del',
    getValue: ({ fob }) => (
      <ty.BodyText>{fob ? 'FOB' : 'Delivery'}</ty.BodyText>
    ),
  },
  {
    key: 'ryanNumber',
    label: 'Recorder Number',
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
    key: 'shipDate',
    label: 'Ship Date',
  },
  {
    key: 'expeditorName',
    label: 'Expeditor',
  },
  {
    key: 'vendorId',
    label: 'Vendor',
  },
  {
    key: 'loadStatus',
    label: 'Load Status',
    getValue: ({ changeFlag, loadStatus }) => {
      const status =
        truckLoadStatusDescriptions[changeFlag ? 'changed' : loadStatus || ''];
      return (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator
            color={status?.color}
            text={status?.text}
            title={status?.title || loadStatus || ''}
          />
        </l.Flex>
      );
    },
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
    key: 'notes',
    label: 'Notes',
  },
];

export const truckLoadStatusDescriptions: {
  [key: string]: { color: string; text: string; title: string };
} = {
  O: {
    color: th.colors.status.success,
    text: 'RTS',
    title: 'Ready to ship',
  },
  P: {
    color: th.colors.status.warningSecondary,
    text: 'PTP',
    title: 'Pick ticket printed',
  },
  C: {
    color: th.colors.status.successAlt,
    text: 'CON',
    title: 'Confirmed - truck has checked in',
  },
  S: {
    color: th.colors.status.successAlt,
    text: 'SHP',
    title: 'Shipped',
  },
  changed: {
    color: th.colors.status.error,
    text: 'FLG',
    title: 'Flagged - order has changed',
  },
};
