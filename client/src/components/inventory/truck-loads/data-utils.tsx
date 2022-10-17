import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import { VENDOR_DISTINCT_VALUES_QUERY } from 'api/directory/vendor';
import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { OrderItem, Pallet, TruckLoad } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';
import th from 'ui/theme';
import { formatTime } from 'utils/date';

export const TRUCK_LOAD_MAX_WEIGHT = 40000;

export type TruckLoadLabelInfo = LabelInfo<TruckLoad>;

export const indexListLabels: (
  customerId?: string[],
) => TruckLoadLabelInfo[] = (customerId) => [
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
    key: 'shipDate',
    label: 'Del Date',
    sortKey: 'deliveredDate',
    sortable: true,
    customSortBy: ({ orderMaster }) => true,
    getValue: ({ orderMaster }) => {
      return orderMaster ? (
        <ty.BodyText>-</ty.BodyText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      );
    },
  },
  {
    key: 'vendorId',
    label: 'Trucker',
    sortable: true,
    customSortBy: ({ vendor }) => vendor?.vendorName.toLowerCase() || 'zzzzz',
    filterable: true,
    filterPanelProps: {
      customStyles: {
        width: 500,
      },
      queryProps: {
        query: VENDOR_DISTINCT_VALUES_QUERY,
        queryName: 'vendorDistinctValues',
        queryVariables: {
          vendorType: 'FR',
        },
      },
      showSearch: true,
    },
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.BodyText>
          {vendor.vendorName} ({vendor.id})
        </ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'orderMaster',
    sortKey: 'customerId',
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
    customFilterBy: ({ orderMaster, invoiceHeader }) => {
      const customer = (orderMaster || invoiceHeader)?.billingCustomer;
      return (
        !customerId ||
        (!!customer &&
          customerId
            .map((val) =>
              val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
            )
            .includes(customer.id))
      );
    },
    customSortBy: ({ orderMaster, invoiceHeader }) =>
      (
        orderMaster || invoiceHeader
      )?.billingCustomer?.customerName?.toLowerCase() || 'zzzzzz',
    getValue: ({ orderMaster, invoiceHeader }) => {
      const customer = (orderMaster || invoiceHeader)?.billingCustomer;
      return customer ? (
        <ty.BodyText>
          {customer.customerName} ({customer.id})
        </ty.BodyText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      );
    },
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
    label: 'Trucker',
    sortable: true,
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.BodyText>
          {vendor.vendorName} ({vendor.id})
        </ty.BodyText>
      ) : (
        ''
      ),
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

export const indexBaseLabels: (
  location?: string,
  isInvoice?: boolean,
) => TruckLoadLabelInfo[] = (location, isInvoice) => [
  {
    key: 'loadId',
    label: 'Load ID',
  },
  {
    key: 'orderMaster',
    label: isInvoice ? 'Invoice ID' : 'Order ID',
    getValue: ({ orderMaster, pallets }) => {
      const pallet = (pallets?.nodes || [])[0];
      return isInvoice ? (
        pallet ? (
          <ty.LinkText
            hover="false"
            to={`/accounting/invoices/${pallet.orderId}`}
          >
            {pallet.orderId}
          </ty.LinkText>
        ) : (
          ''
        )
      ) : orderMaster ? (
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
    label: 'Trucker',
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.vendorName} ({vendor.id})
        </ty.LinkText>
      ) : (
        ''
      ),
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
    key: 'pallets',
    label: 'Est. Total Weight',
    getValue: (tl) => {
      const loadWeight = getTruckLoadWeight(tl);
      const isOverweight = isTruckLoadOverweight(tl);
      const overweightStatus = truckLoadStatusDescriptions.overweight;
      return (
        <l.Flex alignCenter justifyCenter>
          <ty.BodyText
            color={isOverweight ? th.colors.status.error : undefined}
            fontWeight={isOverweight ? 'bold' : undefined}
            mr={th.spacing.sm}
          >
            {loadWeight.toLocaleString()} lbs
          </ty.BodyText>
          {isOverweight && (
            <StatusIndicator
              color={overweightStatus.color}
              text={overweightStatus.text}
              title={overweightStatus.title}
            />
          )}
        </l.Flex>
      );
    },
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
  overweight: {
    color: th.colors.status.errorAlt,
    text: 'OVR',
    title: 'Overweight - estimated weight exceeds max load weight (40,000 lbs)',
  },
};

export const getTruckLoadWeight = ({ orderMaster, pallets }: TruckLoad) => {
  const itemsLoadWeight = (
    (orderMaster?.items?.nodes || []) as OrderItem[]
  ).reduce((acc, item) => {
    const speciesWeight =
      item.inventoryItem?.product?.species?.commonSpecies?.palletWeight || 0;
    const packTypeWeight =
      item.inventoryItem?.product?.packType?.commonPackType?.palletWeight || 0;
    return acc + (packTypeWeight || speciesWeight) * item.palletCount;
  }, 0);

  const palletsLoadWeight = ((pallets?.nodes || []) as Pallet[]).reduce(
    (acc, pallet) => {
      const speciesWeight =
        pallet.product?.species?.commonSpecies?.palletWeight || 0;
      const packTypeWeight =
        pallet.product?.packType?.commonPackType?.palletWeight || 0;
      return acc + parseInt(packTypeWeight || speciesWeight, 10);
    },
    0,
  );

  return palletsLoadWeight || itemsLoadWeight;
};

export const isTruckLoadOverweight = (truckLoad: TruckLoad) =>
  getTruckLoadWeight(truckLoad) > TRUCK_LOAD_MAX_WEIGHT;
