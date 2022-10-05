import { format } from 'date-fns';

import { LabelInfo } from 'components/column-label';
import { getInventoryItemDescription } from 'components/inventory/inventory/utils';
import { OrderItemLabelInfo } from 'components/inventory/orders/items/data-utils';
import { SORT_ORDER } from 'hooks/use-columns';
import { InvoiceItem } from 'types';
import ty from 'ui/typography';
import { formatCurrency } from 'utils/format';

export type InvoiceItemLabelInfo = LabelInfo<InvoiceItem>;

export const listLabels: OrderItemLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'backOrderId',
    label: 'B/O ID',
    sortable: true,
    customSortBy: (data) => (data ? `${data.backOrderId} ${data.lineId}` : ''),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'lineId',
    label: 'Line ID',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'inventoryItem',
    label: 'Description',
    sortable: true,
    customSortBy: ({ inventoryItem }) =>
      inventoryItem ? getInventoryItemDescription(inventoryItem, {}) : 'zzzzz',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {getInventoryItemDescription(inventoryItem, {})}
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
    label: 'Unit Price',
    getValue: ({ unitSellPrice }) =>
      unitSellPrice ? (
        <ty.BodyText>{formatCurrency(parseFloat(unitSellPrice))}</ty.BodyText>
      ) : (
        ''
      ),
  },
];

export const itemListLabels: InvoiceItemLabelInfo[] = [
  {
    key: 'backOrderId',
    label: 'B/O ID',
  },
  {
    key: 'lineId',
    label: 'Line ID',
  },
  {
    key: 'sequenceId',
    label: 'Sequence ID',
  },
];
