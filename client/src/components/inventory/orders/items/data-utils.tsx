import { LabelInfo } from 'components/column-label';
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
            data ? (
              <ty.BodyText>{`${data.lineId} ${data.backOrderId}`}</ty.BodyText>
            ) : (
              ''
            ),
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
      `${inventoryItem?.product?.species?.speciesDescription} ${inventoryItem?.product?.variety?.varietyDescription} ${inventoryItem?.product?.variety?.varietyDescription} ${inventoryItem?.product?.sizes.nodes?.[0]?.combineDescription}`,
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
    label: 'PLU',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>{String(!!inventoryItem.plu)}</ty.BodyText>
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
    label: 'Item Status',
  },
];

export const baseLabels: OrderItemLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
];
