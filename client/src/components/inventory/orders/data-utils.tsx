import { pick, pluck, sortBy, uniq, uniqBy, values } from 'ramda';

import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import { invoiceStatusDescriptions } from 'components/accounting/invoices/data-utils';
import { LabelInfo } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  InvoiceHeader,
  InvoiceItem,
  InvoiceItemHistory,
  OrderComment,
  OrderEntry,
  OrderItem,
  OrderMaster,
  ProductMaster,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { truckLoadStatusDescriptions } from '../truck-loads/data-utils';

export type OrderItemInvoiceItem = OrderItem & {
  invoiceId?: string;
  items?: InvoiceItem[];
};

export type OrderMasterInvoiceHeader = OrderMaster & {
  invoiceId?: string;
  paidCode?: string;
};
export type OrderMasterLabelInfo = LabelInfo<OrderMasterInvoiceHeader>;

export const indexListLabels: (
  isInvoices: boolean,
) => OrderMasterLabelInfo[] = (isInvoices) => [
  ...(isInvoices
    ? [
        {
          key: 'invoiceId',
          label: 'Invoice ID',
          sortable: true,
          getValue: ({ invoiceId }) => (
            <ty.BodyText>{invoiceId || ''}</ty.BodyText>
          ),
        } as OrderMasterLabelInfo,
      ]
    : []),
  {
    key: 'orderId',
    label: 'Order ID',
    sortable: true,
  },
  {
    key: 'truckLoadId',
    label: 'Load ID',
    sortable: true,
    getValue: ({ entryUserCode, truckLoadId }) => (
      <ty.BodyText>
        {!entryUserCode && truckLoadId === '' ? 'HOLD' : truckLoadId || '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'customerPo',
    label: 'PO Number',
    sortable: true,
  },
  {
    key: 'expectedShipDate',
    label: 'Ship Date',
    isDate: true,
    sortable: true,
    customSortBy: ({ expectedShipDate, truckLoad }) =>
      truckLoad?.shipDate
        ? new Date(truckLoad?.shipDate.replace(/-/g, '/'))
        : new Date(expectedShipDate.replace(/-/g, '/')),
    getValue: ({ expectedShipDate, truckLoad }) => (
      <ty.BodyText>
        {truckLoad?.shipDate
          ? formatDate(new Date(truckLoad?.shipDate.replace(/-/g, '/')))
          : formatDate(new Date(expectedShipDate.replace(/-/g, '/')))}
      </ty.BodyText>
    ),
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
          {billingCustomer.customerName} ({billingCustomer.id})
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
    key: isInvoices ? 'paidCode' : 'entryUserCode',
    label: 'Status',
    sortable: true,
    customSortBy: ({
      entryUserCode,
      expectedShipDate,
      orderStatus,
      paidCode,
    }) =>
      `${isInvoices ? paidCode : !entryUserCode ? '0' : orderStatus} ${new Date(
        expectedShipDate.replace(/-/g, '/'),
      ).getTime()}`,
    getValue: ({ entryUserCode, orderStatus, paidCode }) => {
      const status = isInvoices
        ? invoiceStatusDescriptions[paidCode || '']
        : orderStatusDescriptions[entryUserCode ? orderStatus || '' : 'review'];
      return (
        <l.Flex alignCenter justifyCenter>
          {status ? (
            <StatusIndicator
              color={status?.color}
              customStyles={{
                wrapper: {
                  py: th.spacing.tn,
                },
              }}
              text={status?.text}
              title={status?.title || orderStatus || ''}
            />
          ) : (
            <ty.BodyText>-</ty.BodyText>
          )}
        </l.Flex>
      );
    },
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
      const orderItems = (items?.nodes || []) as OrderItem[];
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
    customSortBy: ({ entryUserCode, expectedShipDate, orderStatus }) =>
      `${!entryUserCode ? '0' : orderStatus} ${new Date(
        expectedShipDate.replace(/-/g, '/'),
      ).getTime()}`,
    getValue: ({ entryUserCode, orderStatus }) => {
      const status =
        orderStatusDescriptions[entryUserCode ? orderStatus || '' : 'review'];
      return (
        <l.Flex alignCenter justifyCenter>
          {status ? (
            <StatusIndicator
              color={status?.color}
              customStyles={{
                wrapper: {
                  py: th.spacing.tn,
                },
              }}
              text={status?.text}
              title={status?.title || orderStatus || ''}
            />
          ) : (
            <ty.BodyText>-</ty.BodyText>
          )}
        </l.Flex>
      );
    },
  },
];

export const indexBaseLabels: (
  backOrderId?: string,
) => OrderMasterLabelInfo[] = (backOrderId) => [
  {
    key: 'orderId',
    label: 'Order ID',
  },
  {
    key: 'truckLoadId',
    label: 'Truck Load ID',
    getValue: ({ shipWarehouse, truckLoad, truckLoadId }) =>
      truckLoad || truckLoadId ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/truck-loads/${
            truckLoad?.loadId || truckLoadId || ''
          }?truckLoadView=${backOrderId ? 'pallets' : 'pickupLocations'}${
            backOrderId && shipWarehouse ? `&location=${shipWarehouse.id}` : ''
          }`}
        >
          {truckLoad?.loadId || truckLoadId || ''}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
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
    key: 'comments',
    label: 'Comments',
    getValue: (orderMaster) => {
      const comments = sortBy(
        (om) => `${om.backOrderId} ${om.lineId}`,
        (orderMaster?.comments?.nodes || []) as OrderComment[],
      );
      return (
        <l.Div>
          {comments.length > 0 ? (
            <>
              {comments.map(({ printCode, notes }, idx) => (
                <l.Flex
                  alignCenter
                  justifyBetween
                  key={idx}
                  ml={th.spacing.xs}
                  mr={th.spacing.md}
                  mb={th.spacing.sm}
                  mt={th.spacing.xs}
                >
                  <ty.CaptionText nowrap>{notes}</ty.CaptionText>
                  <ty.CaptionText ml={th.spacing.sm} textAlign="right">
                    ({printCode})
                  </ty.CaptionText>
                </l.Flex>
              ))}
            </>
          ) : (
            <ty.BodyText>-</ty.BodyText>
          )}
        </l.Div>
      );
    },
  },
];

export const baseLabels: OrderMasterLabelInfo[] = [
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
    key: 'fob',
    label: 'FOB / Del',
    getValue: ({ fob }) => (
      <ty.BodyText>{fob ? 'FOB' : 'Delivery'}</ty.BodyText>
    ),
  },
  {
    key: 'actualShipDate',
    label: 'Ship Date',
    isDate: true,
  },
  {
    key: 'expectedShipDate',
    label: 'Delivered Date',
    isDate: true,
    getValue: ({ expectedShipDate, fob }) => (
      <ty.BodyText>
        {fob ? '-' : formatDate(new Date(expectedShipDate.replace(/-/g, '/')))}
      </ty.BodyText>
    ),
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
    key: 'vendorId',
    label: 'Trucker',
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.vendorName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'orderStatus',
    label: 'Order Status',
    getValue: ({ entryUserCode, orderStatus }) => {
      const status =
        orderStatusDescriptions[entryUserCode ? orderStatus || '' : 'review'];
      return (
        <l.Flex alignCenter justifyCenter>
          {status ? (
            <StatusIndicator
              color={status?.color}
              text={status?.text}
              title={status?.title || orderStatus || ''}
            />
          ) : (
            <ty.BodyText>-</ty.BodyText>
          )}
        </l.Flex>
      );
    },
  },
  {
    key: 'backOrderId',
    label: 'Back Order ID',
  },
  {
    key: 'deliveryZone',
    label: 'Delivery Zone',
  },
  {
    key: 'loadStatus',
    label: 'Load Status',
    getValue: ({ loadStatus, truckLoad }) => {
      const status =
        truckLoadStatusDescriptions[
          truckLoad?.changeFlag ? 'changed' : loadStatus || ''
        ];
      return (
        <l.Flex alignCenter justifyCenter>
          {status ? (
            <StatusIndicator
              color={status?.color}
              text={status?.text}
              title={status?.title || loadStatus || ''}
            />
          ) : (
            <ty.BodyText>-</ty.BodyText>
          )}
        </l.Flex>
      );
    },
  },
];

export const convertOrderEntriesToOrderMasters = (orderEntries: OrderEntry[]) =>
  uniqBy((entry) => entry.orderId, orderEntries).map((entry) => ({
    ...pick(
      ['orderId', 'truckLoadId', 'customerPo', 'billingCustomer', 'salesUser'],
      entry,
    ),
    entryUser: entry.reviewUser,
    expectedShipDate: entry.fobDate,
  })) as OrderMaster[];

const getOrderInvoiceItems = (
  orderInvoices: OrderMasterInvoiceHeader[],
  invoiceItems: InvoiceItem[],
) =>
  orderInvoices
    .map(({ items }) =>
      ((items.nodes || []) as OrderItem[]).map(
        (item) =>
          ({
            ...item,
            items:
              invoiceItems?.filter(
                (invoiceItem) =>
                  `${item.orderId}-${item.backOrderId}-${item.lineId}` ===
                  `${invoiceItem.orderId}-${invoiceItem.backOrderId}-${invoiceItem.lineId}`,
              ) || [],
          } as OrderItemInvoiceItem),
      ),
    )
    .flat();

const convertInvoiceItemsToOrderItems = (
  invoiceHeader: InvoiceHeader,
  invoiceItems: InvoiceItem[],
) =>
  values(
    invoiceItems.reduce<{
      [key: string]: OrderItem;
    }>((acc, item) => {
      const currentItem =
        acc[`${item.orderId}-${item.backOrderId}-${item.lineId}`];
      return {
        ...acc,
        [`${item.orderId}-${item.backOrderId}-${item.lineId}`]: {
          ...pick(
            [
              'orderId',
              'backOrderId',
              'lineId',
              'unitSellPrice',
              'deliveryCharge',
            ],
            item,
          ),
          boxCount:
            (currentItem?.boxCount ? parseInt(currentItem?.boxCount, 10) : 0) +
            (parseInt(item.pickedQty, 10) > 0
              ? parseInt(item.pickedQty, 10)
              : 0),
          palletCount:
            (currentItem?.palletCount
              ? parseInt(currentItem?.palletCount)
              : 0) + 1,
          unitSellPrice:
            item?.unitSellPrice > 0
              ? item?.unitSellPrice
              : currentItem?.unitSellPrice || 0,
          inventoryItem: {
            ...(item.pallet || {}),
            ...(item.pallet?.vessel || {}),
            plu: item.pallet?.packType?.pluUpcCode === 'Y',
            product: (item.pallet?.product || {}) as ProductMaster,
          },
          invoiceId: invoiceHeader?.invoiceId,
          order: {
            orderId: invoiceHeader?.orderId,
            customerPo: invoiceHeader?.customerPo,
            truckLoadId: invoiceHeader?.truckLoadId,
            backOrderId: invoiceHeader?.backOrderId,
            invoiceId: invoiceHeader?.invoiceId,
            actualShipDate: invoiceHeader?.actualShipDate,
            expectedShipDate: invoiceHeader?.expectedShipDate,
            salesUserCode: invoiceHeader?.salesUserCode,
            billingCustomer: invoiceHeader?.billingCustomer,
          } as OrderMasterInvoiceHeader,
        } as OrderItemInvoiceItem,
      };
    }, {} as { [key: string]: OrderItemInvoiceItem }),
  );

const convertInvoiceHeaderToOrderMaster = (invoiceHeader: InvoiceHeader) => ({
  ...pick(
    [
      'orderId',
      'backOrderId',
      'truckLoadId',
      'customerPo',
      'billingCustomer',
      'salesUser',
      'invoiceId',
      'paidCode',
    ],
    invoiceHeader,
  ),
  expectedShipDate: invoiceHeader.actualShipDate,
  orderStatus: 'SHP',
  items: {
    nodes: convertInvoiceItemsToOrderItems(
      invoiceHeader,
      (invoiceHeader.items?.nodes || []) as InvoiceItem[],
    ),
  },
});

export const convertInvoiceHeadersToOrderMasters = (
  invoiceHeaders: InvoiceHeader[],
  invoiceItems?: InvoiceItem[],
  rejectedInvoices?: InvoiceHeader[],
) => {
  const orderInvoices = invoiceHeaders.map(
    convertInvoiceHeaderToOrderMaster,
  ) as OrderMasterInvoiceHeader[];

  const orderInvoiceItems = invoiceItems
    ? getOrderInvoiceItems(orderInvoices, invoiceItems)
    : [];

  const rejectedOrderItems = (rejectedInvoices
    ?.map((ihs) => ihs?.items?.nodes || [])
    .flat() || []) as InvoiceItem[];

  const rejectedOrderInvoices = (rejectedInvoices?.map(
    convertInvoiceHeaderToOrderMaster,
  ) || []) as OrderMasterInvoiceHeader[];

  const palletIds = ((invoiceItems || []) as InvoiceItem[])
    .concat(rejectedOrderItems)
    .map((item) => item.palletId || item.pallet?.palletId);

  const itemHistories = (invoiceHeaders
    .map((ihs) => ihs?.itemHistories?.nodes || [])
    .flat() || []) as InvoiceItemHistory[];

  const deletedItems = getOrderInvoiceItems(
    orderInvoices,
    (itemHistories as InvoiceItem[]).filter(
      (item) =>
        item && !palletIds.includes(item.palletId || item.pallet?.palletId),
    ),
  ).filter((item) => item?.items && item.items.length > 0);

  return {
    deletedItems,
    invoices: orderInvoices,
    items: orderInvoiceItems,
    rejectedItems: getOrderInvoiceItems(
      rejectedOrderInvoices,
      rejectedOrderItems,
    ),
  };
};

export const orderSteps = [
  {
    id: 'reviewing',
    text: 'In Review',
  },
  {
    id: 'ready',
    text: 'Ready To Ship',
  },
  {
    id: 'loading',
    text: 'Loading',
  },
  {
    id: 'shipped',
    text: 'Shipped',
  },
];

export const getCurrentOrderStep = (
  orderEntries: OrderEntry[],
  orderMasters: OrderMaster[],
) => {
  const hasOrderEntries = orderEntries.length > 0;
  const hasOrderMasters = orderMasters.length > 0;
  const anyOrdersLoading = orderMasters.some(
    (order) => order.loadStatus === 'c',
  );
  const allPickupsShipped = orderMasters.every(
    (orderMaster) => orderMaster.orderStatus === 'a',
  );

  if (hasOrderEntries && !hasOrderMasters) {
    return orderSteps[0];
  }
  if (allPickupsShipped) {
    return orderSteps[3];
  }
  if (anyOrdersLoading) {
    return orderSteps[2];
  }
  if (hasOrderMasters) {
    return orderSteps[1];
  }
  return orderSteps[0];
};

const orderStatusDescriptions: {
  [key: string]: { color: string; text: string; title: string };
} = {
  A: {
    color: th.colors.status.successAlt,
    text: 'SHP',
    title: 'Shipped',
  },
  O: { color: th.colors.brand.secondary, text: 'O', title: 'Other' },
  B: {
    color: th.colors.status.success,
    text: 'RTS',
    title: 'Ready To Ship',
  },
  C: { color: th.colors.status.error, text: 'CAN', title: 'Cancelled' },
  review: { color: th.colors.status.warning, text: 'REV', title: 'In Review' },
};
