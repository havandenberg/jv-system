import api from 'api';
import ListItem from 'components/list-item';
import usePrevious from 'hooks/use-previous';
import { pluck, sum, uniq } from 'ramda';
import { useEffect, useMemo } from 'react';
import { OrderItem, RepackQueue } from 'types';
import th from 'ui/theme';

import { gridTemplateColumns, UpdatedQueueItem } from '.';
import { indexListLabels as listLabels } from './data-utils';

const RepackQueueItem = ({
  currentQueueItem,
  handleChange,
  handleSetUpdatedItem,
  hasValidPackType,
  item,
  repackStyleKey,
  saveAttempt,
  scrollTop,
  selected,
}: {
  currentQueueItem?: RepackQueue;
  handleChange: (updatedItem: RepackQueue) => void;
  handleSetUpdatedItem: (updatedQueueItem: UpdatedQueueItem) => void;
  hasValidPackType: boolean;
  item: RepackQueue;
  repackStyleKey?: string;
  saveAttempt: boolean;
  scrollTop: number;
  selected: boolean;
}) => {
  const { data: invoices, loading: invoiceLoading } = api.useInvoice(
    item.orderId || 0,
  );
  const { data: orders, loading: orderLoading } = api.useOrder(
    item.orderId || 0,
  );
  const loading = orderLoading || invoiceLoading;
  const previousLoading = usePrevious(orderLoading || invoiceLoading);

  const invoice = invoiceLoading
    ? undefined
    : invoices?.nodes?.[0] || item.invoices?.nodes?.[0] || undefined;

  const invoiceWithFilteredItems = useMemo(
    () =>
      invoice
        ? {
            ...invoice,
            items: {
              ...invoice.items,
              nodes: invoice.items.nodes.filter(
                (ii) =>
                  ii?.repackCode && item.repackStyle?.lqdCode === ii.repackCode,
              ),
            },
          }
        : undefined,
    [item.repackStyle?.lqdCode, invoice],
  );

  const order = orderLoading
    ? undefined
    : orders?.nodes?.find(
        (om) =>
          (om?.items?.nodes?.filter(
            (oi) =>
              oi?.specialLotNumber &&
              [item.repackStyleId, repackStyleKey].includes(
                oi.specialLotNumber,
              ),
          ).length || 0) > 0,
      ) ||
      item.orders?.nodes?.find(
        (om) =>
          (om?.items?.nodes?.filter(
            (oi) =>
              oi?.specialLotNumber &&
              [item.repackStyleId, repackStyleKey].includes(
                oi.specialLotNumber,
              ),
          ).length || 0) > 0,
      ) ||
      undefined;

  const orderWithFilteredItems = useMemo(
    () =>
      order
        ? {
            ...order,
            items: {
              ...order.items,
              nodes: order.items.nodes.filter(
                (oi) =>
                  oi?.specialLotNumber &&
                  [item.repackStyleId, repackStyleKey].includes(
                    oi.specialLotNumber,
                  ),
              ),
            },
          }
        : undefined,
    [item.repackStyleId, order, repackStyleKey],
  );

  const isCancelled = order?.orderStatus === 'C';
  const isShipped = item.invoices.totalCount > 0;
  const isNew = item.id < 0;

  const updatedQueueItem = useMemo(
    () => ({
      orderId: item.orderId || 0,
      repackStyleId: item.repackStyleId || '',
      palletCount: invoiceWithFilteredItems
        ? invoiceWithFilteredItems.items.nodes.length
        : sum(
            orderWithFilteredItems?.items?.nodes?.map((oi) =>
              oi ? parseInt(oi.palletCount, 10) : 0,
            ) || [],
          ),
      warehouseId: invoiceWithFilteredItems
        ? invoiceWithFilteredItems.shipWarehouseId || ''
        : uniq(
            pluck(
              'locationId',
              (orderWithFilteredItems?.items?.nodes || []) as OrderItem[],
            ),
          )?.[0] || '',
      shipDate:
        orderWithFilteredItems?.actualShipDate ||
        invoiceWithFilteredItems?.actualShipDate ||
        null,
      delDate:
        orderWithFilteredItems?.expectedShipDate ||
        invoiceWithFilteredItems?.expectedShipDate ||
        null,
    }),
    [item, orderWithFilteredItems, invoiceWithFilteredItems],
  );

  const isDirty =
    item.id > 0 &&
    (updatedQueueItem.palletCount !== (parseInt(item.palletCount, 0) || 0) ||
      updatedQueueItem.shipDate !== item.shipDate);

  useEffect(() => {
    if (previousLoading && !loading && isDirty) {
      handleSetUpdatedItem(updatedQueueItem);
    }
  }, [
    handleSetUpdatedItem,
    isDirty,
    loading,
    previousLoading,
    updatedQueueItem,
  ]);

  return (
    <ListItem<RepackQueue>
      data={item}
      error={saveAttempt && (!hasValidPackType || (!selected && isDirty))}
      gridTemplateColumns={gridTemplateColumns}
      hoverable
      listLabels={listLabels(
        handleChange,
        saveAttempt,
        currentQueueItem,
        invoiceWithFilteredItems,
        orderWithFilteredItems,
      )}
      isHalfHighlight={isShipped}
      isHighlight={
        isNew || ((!!order || !!invoice) && (isCancelled || isDirty))
      }
      highlightColor={
        isCancelled
          ? th.colors.status.error
          : isNew || isShipped
          ? th.colors.status.success
          : isDirty
          ? th.colors.status.warning
          : undefined
      }
      offsetTop={scrollTop}
      to={
        isShipped && item.repackCode
          ? `/inventory/repacks/${item.repackCode}`
          : undefined
      }
    />
  );
};

export default RepackQueueItem;
