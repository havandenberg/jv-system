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
    key: 'lineId',
    label: 'Line ID',
    sortable: true,
    customSortBy: ({ lineId }) => parseInt(lineId, 10),
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
    label: 'PLU',
    getValue: ({ inventoryItem }) =>
      inventoryItem ? (
        <ty.BodyText>
          {inventoryItem.packType?.pluUpcCode === 'Y' ? 'PLU' : 'NO PLU'}
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
        <ty.LinkText
          hover="false"
          to={`/inventory/vessels/${inventoryItem.vessel?.vesselCode}?isPre=0`}
        >
          {inventoryItem.vessel?.vesselCode}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
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
    key: 'sequenceId',
    label: 'Sequence ID',
  },
  {
    key: 'palletId',
    label: 'Pallet ID',
    getValue: ({ pallet }) => (
      <ty.LinkText hover="false" to={`/inventory/pallets/${pallet?.palletId}`}>
        {pallet?.palletId}
      </ty.LinkText>
    ),
  },
  {
    key: 'pickedQty',
    label: 'Box Count',
  },
];
