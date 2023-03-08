import { format, isAfter } from 'date-fns';
import { pluck, sortBy, sum, uniq } from 'ramda';

import HighlightImg from 'assets/images/highlight';
import {
  dateTimePickerProps,
  LocalDateTimePicker,
} from 'components/accounting/vessel-control/data-utils';
import { LabelInfo } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import EditableCell from 'components/editable-cell';
import InfoPanel from 'components/info-panel';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  InvoiceHeader,
  OrderComment,
  OrderItem,
  OrderMaster,
  RepackQueue,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { isDateGreaterThanOrEqualTo } from 'utils/date';

import { warehouseOptions } from '.';

export type RepackQueueLabelInfo = LabelInfo<RepackQueue>;

export const indexListLabels: (
  handleChange: (updatedItem: RepackQueue) => void,
  saveAttempt: boolean,
  currentQueueItem?: RepackQueue,
  invoice?: InvoiceHeader,
  order?: OrderMaster,
) => RepackQueueLabelInfo[] = (
  handleChange,
  saveAttempt,
  currentQueueItem,
  invoice,
  order,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'orderId',
    label: 'Load ID',
    sortable: true,
    sortKey: 'loadId',
    customSortBy: () => invoice?.truckLoadId || order?.truckLoad?.loadId,
    getValue: ({ id, orderId }) =>
      orderId && (invoice?.truckLoadId || order?.truckLoad?.loadId) ? (
        <ty.LinkText
          bold={
            id > 0 &&
            (!currentQueueItem || currentQueueItem.orderId !== orderId)
          }
          hover="false"
          target="_blank"
          to={`/inventory/truck-loads/${
            invoice?.truckLoadId || order?.truckLoad?.loadId
          }`}
        >
          {invoice?.truckLoadId || order?.truckLoad?.loadId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'orderId',
    label: 'Order ID',
    sortable: true,
    customSortBy: () => invoice?.orderId || order?.orderId || '000',
    getValue: ({ id, orderId }) =>
      orderId && (!!invoice || !!order) ? (
        <ty.LinkText
          bold={
            id > 0 &&
            (!currentQueueItem || currentQueueItem.orderId !== orderId)
          }
          hover="false"
          target="_blank"
          to={`${
            invoice?.orderId ? '/accounting/invoices' : '/inventory/orders'
          }/${orderId}?orderView=orderItems`}
        >
          {orderId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'orderId',
    label: 'Customer Name',
    getValue: ({ id, orderId }) => {
      const billingCustomer =
        invoice?.billingCustomer || order?.billingCustomer;
      return billingCustomer ? (
        <ty.LinkText
          bold={
            id > 0 &&
            (!currentQueueItem || currentQueueItem.orderId !== orderId)
          }
          hover="false"
          target="_blank"
          to={`/directory/customers/${billingCustomer.id}`}
        >
          {billingCustomer.customerName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      );
    },
  },
  {
    key: 'orderId',
    label: 'FOB / Del',
    getValue: ({ id, orderId }) => {
      const fob = invoice ? invoice.vendor === null : order?.fob;
      return (
        <ty.BodyText
          bold={
            id > 0 &&
            (!currentQueueItem || currentQueueItem.orderId !== orderId)
          }
        >
          {fob !== undefined && (!!invoice || !!order)
            ? fob
              ? 'FOB'
              : 'Del'
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'orderId',
    label: 'FOB Date',
    getValue: ({ repackDate, shipDate }) => {
      const currentShipDate = invoice?.actualShipDate || order?.actualShipDate;
      const isDirty = !currentShipDate || currentShipDate !== shipDate;
      const isInvalidNewShipDate =
        repackDate &&
        currentShipDate &&
        isAfter(
          new Date(repackDate.replace(/-/g, '/')),
          new Date(currentShipDate.replace(/-/g, '/')),
        );
      return (
        <ty.BodyText>
          {currentShipDate !== undefined && (shipDate || currentShipDate) ? (
            <>
              {shipDate &&
                format(new Date(shipDate.replace(/-/g, '/')), 'M-dd')}
              {isDirty && currentShipDate ? (
                <ty.Span
                  bold
                  color={
                    isInvalidNewShipDate ? th.colors.status.errorAlt : undefined
                  }
                >
                  &nbsp;(
                  {format(new Date(currentShipDate.replace(/-/g, '/')), 'M-dd')}
                  )
                </ty.Span>
              ) : (
                ''
              )}
            </>
          ) : (
            '-'
          )}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'orderId',
    label: 'Del Date',
    getValue: ({ repackDate, delDate }) => {
      const isFob = invoice ? invoice.vendor === null : order?.fob;
      const currentDelDate =
        invoice?.expectedShipDate || order?.expectedShipDate;
      const isDirty = !currentDelDate || currentDelDate !== delDate;
      const isInvalidNewDelDate =
        repackDate &&
        currentDelDate &&
        isAfter(
          new Date(repackDate.replace(/-/g, '/')),
          new Date(currentDelDate.replace(/-/g, '/')),
        );
      return (
        <ty.BodyText>
          {isFob !== undefined && !isFob && (delDate || currentDelDate) ? (
            <>
              {delDate && format(new Date(delDate.replace(/-/g, '/')), 'M-dd')}
              {isDirty && currentDelDate ? (
                <ty.Span
                  bold
                  color={
                    isInvalidNewDelDate ? th.colors.status.errorAlt : undefined
                  }
                >
                  &nbsp;(
                  {format(new Date(currentDelDate.replace(/-/g, '/')), 'M-dd')})
                </ty.Span>
              ) : (
                ''
              )}
            </>
          ) : (
            '-'
          )}
        </ty.BodyText>
      );
    },
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'palletCount',
    label: 'Pallet Count',
    sortable: true,
    customSortBy: ({ palletCount }) => palletCount,
    getValue: ({ palletCount }) => {
      const updatedPalletCount = invoice
        ? invoice.items.nodes.length
        : sum(
            order?.items?.nodes?.map((oi) =>
              oi ? parseInt(oi.palletCount, 10) : 0,
            ) || [],
          );
      const isDirty = order && updatedPalletCount !== parseInt(palletCount, 10);
      return (
        <ty.BodyText center>
          {palletCount && updatedPalletCount ? (
            <>
              {palletCount}
              {isDirty ? (
                <ty.Span bold>
                  &nbsp;(
                  {updatedPalletCount})
                </ty.Span>
              ) : (
                ''
              )}
            </>
          ) : (
            '-'
          )}
        </ty.BodyText>
      );
    },
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'orderId',
    label: 'Size',
    getValue: () => {
      const orderItems = order?.items?.nodes;
      const orderSizes = orderItems
        ? uniq(
            orderItems.map(
              (oi) =>
                oi?.inventoryItem?.product?.sizes?.nodes?.[0]?.jvDescription ||
                'UNK',
            ),
          ).join(', ')
        : undefined;
      const invoiceItems = invoice?.items?.nodes;
      const invoiceSizes = invoiceItems
        ? uniq(
            invoiceItems.map(
              (ii) =>
                ii?.pallet?.product?.sizes?.nodes?.[0]?.jvDescription || 'UNK',
            ),
          ).join(', ')
        : undefined;
      return <ty.BodyText>{orderSizes || invoiceSizes || '-'}</ty.BodyText>;
    },
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'orderId',
    label: 'Label',
    getValue: () => {
      const orderItems = order?.items?.nodes;
      const orderLabels = orderItems
        ? uniq(
            orderItems.map(
              (oi) =>
                oi?.inventoryItem?.product?.packType?.label?.labelName || 'UNK',
            ),
          ).join(', ')
        : undefined;
      const invoiceItems = invoice?.items?.nodes;
      const invoiceLabels = invoiceItems
        ? uniq(
            invoiceItems.map(
              (ii) => ii?.pallet?.product?.packType?.label?.labelName || 'UNK',
            ),
          ).join(', ')
        : undefined;
      return <ty.BodyText>{orderLabels || invoiceLabels || '-'}</ty.BodyText>;
    },
  },
  {
    key: 'warehouse',
    label: 'Location',
    allowOverflow: true,
    filterable: true,
    filterPanelProps: {
      customOptions: pluck('warehouseName', warehouseOptions),
      portalId: 'repack-queue-portal',
      portalTop: -4,
    },
    getValue: ({ id, warehouseId }) => {
      const warehouse = warehouseOptions.find((w) => w.id === warehouseId);
      const currentWarehouseId = invoice
        ? invoice.shipWarehouseId
        : uniq(
            pluck('locationId', (order?.items?.nodes || []) as OrderItem[]),
          )?.[0];
      const currentWarehouse = warehouseOptions.find(
        (w) => w.id === currentWarehouseId,
      );
      const isDirty =
        id > 0 && (!currentQueueItem || currentWarehouse?.id !== warehouse?.id);
      return (
        <l.Flex
          alignCenter
          border={th.borders.primary}
          borderRadius={th.borderRadii.default}
          bg={currentWarehouse ? currentWarehouse.color : th.colors.background}
          height={24}
        >
          <ty.BodyText bold={isDirty} ml={th.spacing.xs}>
            {currentWarehouse
              ? currentWarehouse?.warehouseName
              : currentWarehouseId || ''}
          </ty.BodyText>
        </l.Flex>
      );
    },
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'repackDate',
    label: 'Repack Date',
    isDate: true,
    allowOverflow: true,
    sortable: true,
    customSortBy: ({ repackDate }) =>
      repackDate ? new Date(repackDate.replace(/-/g, '/')) : null,
    getValue: ({ repackDate, ...rest }) => {
      const currentShipDate = invoice?.actualShipDate || order?.actualShipDate;
      const repackDateValue = repackDate
        ? new Date(repackDate.replace(/-/g, '/'))
        : null;
      const shipDateValue = currentShipDate
        ? new Date(currentShipDate.replace(/-/g, '/'))
        : null;
      const isValidDate =
        !repackDateValue ||
        (repackDateValue &&
          shipDateValue &&
          isDateGreaterThanOrEqualTo(shipDateValue, repackDateValue));
      return (
        <l.Div cursor="text">
          <LocalDateTimePicker
            dirty={
              !currentQueueItem || currentQueueItem.repackDate !== repackDate
            }
            error={saveAttempt && !isValidDate}
            onChange={(date: Date) => {
              handleChange({
                ...rest,
                repackDate:
                  !date || (date as any)?.type === 'change'
                    ? undefined
                    : formatDate(date),
              });
            }}
            value={repackDateValue}
            {...dateTimePickerProps}
          />
        </l.Div>
      );
    },
    validate: ({ repackDate, shipDate }) =>
      !repackDate ||
      !shipDate ||
      (!!repackDate &&
        !!shipDate &&
        isDateGreaterThanOrEqualTo(
          new Date(shipDate.replace(/-/g, '/')),
          new Date(repackDate.replace(/-/g, '/')),
        )),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'repackCode',
    label: 'Repack Code',
    sortable: true,
    customSortBy: ({ repackCode }) => repackCode?.toLowerCase(),
    getValue: (updatedItem) => (
      <EditableCell
        bypassLocalValue
        content={{
          dirty:
            !currentQueueItem ||
            currentQueueItem.repackCode !== updatedItem.repackCode,
          value: updatedItem.repackCode || '',
        }}
        defaultChildren={null}
        editing={true}
        inputProps={{
          width: th.sizes.fill,
        }}
        onChange={(e) => {
          handleChange({ ...updatedItem, repackCode: e.target.value });
        }}
      />
    ),
  },
  {
    key: 'orderNotes',
    label: 'Order Notes',
    allowOverflow: true,
    getValue: ({ orderNotes, ...rest }) => {
      const comments = sortBy(
        (om) => `${om.backOrderId} ${om.lineId}`,
        ((order?.comments?.nodes || []) as OrderComment[]).filter(
          (c) => c.printCode === '2',
        ),
      );
      return (
        <l.Flex alignCenter>
          {comments.length > 0 ? (
            <InfoPanel
              content={
                <div>
                  <ty.CaptionText mb={th.spacing.sm} secondary>
                    Comments:
                  </ty.CaptionText>
                  {comments.length > 0 ? (
                    <>
                      {comments.map(({ printCode, notes }, idx) => (
                        <ty.CaptionText
                          key={idx}
                          ml={th.spacing.xs}
                          mr={th.spacing.md}
                          mb={th.spacing.sm}
                          mt={th.spacing.xs}
                        >
                          {notes}
                        </ty.CaptionText>
                      ))}
                    </>
                  ) : (
                    <ty.BodyText>-</ty.BodyText>
                  )}
                </div>
              }
              hover
              customStyles={{
                top: 16,
                width: 'auto',
              }}
              triggerIcon={
                <HighlightImg
                  fill={th.colors.brand.secondary}
                  height={th.sizes.xs}
                  width={th.sizes.xs}
                />
              }
              visible
            />
          ) : (
            <l.Div width={th.sizes.xs} />
          )}
          <EditableCell
            content={{
              dirty:
                !currentQueueItem || currentQueueItem.orderNotes !== orderNotes,
              value: orderNotes || '',
            }}
            defaultChildren={null}
            editing={true}
            inputProps={{
              marginLeft: th.spacing.sm,
              width: th.sizes.fill,
            }}
            onChange={(e) => {
              handleChange({ ...rest, orderNotes: e.target.value });
            }}
          />
        </l.Flex>
      );
    },
  },
  {
    key: 'notes',
    label: 'Notes',
    getValue: ({ notes, ...rest }) => (
      <EditableCell
        content={{
          dirty: !currentQueueItem || currentQueueItem.notes !== notes,
          value: notes || '',
        }}
        defaultChildren={null}
        editing={true}
        inputProps={{
          width: th.sizes.fill,
        }}
        onChange={(e) => {
          handleChange({ ...rest, notes: e.target.value });
        }}
      />
    ),
  },
];

export const listLabels: RepackQueueLabelInfo[] = [
  {
    key: 'repackCode',
    label: 'Repack Code',
    getValue: ({ repackCode }) => (
      <ty.BodyText>{repackCode || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'repackDate',
    label: 'Repack Date',
    getValue: ({ repackDate }) => (
      <ty.BodyText>{repackDate || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'repackStyle',
    label: 'Pack Type',
    getValue: ({ repackStyle }) => (
      <ty.BodyText>{repackStyle?.styleDescription || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'warehouse',
    label: 'Pack Location',
    getValue: ({ warehouse }) => (
      <ty.BodyText>{warehouse?.warehouseName || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'palletCount',
    label: 'Pallet Ct.',
    getValue: ({ palletCount }) => (
      <ty.BodyText>{palletCount || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'repackHeaders',
    label: 'Boxes Out/In',
    getValue: ({ repackHeaders }) => {
      const repackHeader = repackHeaders.nodes?.[0];
      if (!repackHeader) return <ty.BodyText>-</ty.BodyText>;

      const { boxesIn, boxesOut } = repackHeader || {};
      const boxesInNum = parseInt(boxesIn, 10);
      const boxesOutNum = parseInt(boxesOut, 10);
      const boxRatio = boxesInNum && boxesOutNum ? boxesOutNum / boxesInNum : 0;
      const isLoss = boxRatio < 1;
      const isGain = boxRatio > 1;

      return (
        <ty.BodyText
          color={
            isLoss
              ? th.colors.status.errorAlt
              : isGain
              ? th.colors.status.success
              : undefined
          }
        >
          {boxRatio ? (boxRatio * 100).toFixed(1) + ' %' : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'repackHeaders',
    label: 'Lbs Out/In',
    getValue: ({ repackHeaders }) => {
      const repackHeader = repackHeaders.nodes?.[0];
      if (!repackHeader) return <ty.BodyText>-</ty.BodyText>;

      const { weightIn, weightOut } = repackHeader || {};
      const weightInNum = parseFloat(weightIn);
      const weightOutNum = parseFloat(weightOut);
      const weightRatio =
        weightInNum && weightOutNum ? weightOutNum / weightInNum : 0;
      const isLoss = weightRatio < 1;
      const isGain = weightRatio > 1;

      return (
        <ty.BodyText
          color={
            isLoss
              ? th.colors.status.errorAlt
              : isGain
              ? th.colors.status.success
              : undefined
          }
        >
          {weightRatio ? (weightRatio * 100).toFixed(1) + ' %' : '-'}
        </ty.BodyText>
      );
    },
  },
];

const newRepackQueue = {
  id: 0,
  repackDate: null,
  repackCode: '',
  invoices: {
    totalCount: 0,
  },
  orderNotes: '',
  notes: '',
};

export const getNewRepackQueues = (
  newRepackQueues: string[],
  newItemNextId: number,
) =>
  newRepackQueues.map((nrp, idx) => {
    const [
      orderId,
      repackStyleId,
      warehouseId,
      shipDate,
      delDate,
      palletCount,
    ] = nrp.split('|');
    return {
      ...newRepackQueue,
      id: newItemNextId - idx,
      orderId,
      repackStyleId,
      warehouseId,
      shipDate,
      delDate,
      palletCount,
    };
  }) as RepackQueue[];
