import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { Pallet, PalletSection } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';

export type PalletLabelInfo = LabelInfo<Pallet>;

export const listLabels: PalletLabelInfo[] = [
  {
    key: 'palletId',
    label: 'ID',
    sortable: true,
  },
  {
    key: 'vesselCode',
    label: 'Vessel',
    getValue: ({ vessel }) => (vessel ? vessel.vesselCode : ''),
  },
  {
    key: 'shipper',
    label: 'Shipper',
    getValue: (data) => data.shipper?.shipperName || '',
  },
  {
    key: 'product',
    label: 'Species',
    getValue: (data) => data.product?.species?.speciesDescription || '',
  },
  {
    key: 'product',
    label: 'Variety',
    getValue: (data) => data.product?.variety?.varietyDescription || '',
  },
  {
    key: 'product',
    label: 'Size',
    getValue: (data) => data.sizes?.nodes[0]?.combineDescription || '',
  },
  {
    key: 'product',
    label: 'Pack Type',
    getValue: (data) =>
      data.packType
        ? data.packType?.label?.labelName +
          ' - ' +
          data.packType?.packDescription
        : '',
  },
  {
    key: 'currentBoxQuantity',
    label: 'Box Qty',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    getValue: ({ shipped }) => (
      <l.Flex alignCenter justifyBetween>
        <StatusIndicator status={shipped ? 'success' : 'error'} />
      </l.Flex>
    ),
  },
];

export const inventoryListLabels: PalletLabelInfo[] = [
  {
    key: 'palletId',
    label: 'ID',
  },
  {
    key: 'containerId',
    label: 'Container ID',
  },
  {
    key: 'growerId',
    label: 'Grower',
  },
  {
    key: 'packDate',
    label: 'Pack Date',
  },
  {
    key: 'currentBoxQuantity',
    label: 'Current Box Qty',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    getValue: ({ shipped }) => (
      <l.Flex alignCenter justifyBetween>
        <StatusIndicator status={shipped ? 'success' : 'error'} />
      </l.Flex>
    ),
  },
];

export const baseLabels: PalletLabelInfo[] = [
  {
    key: 'palletId',
    label: 'ID',
  },
  {
    key: 'vesselCode',
    label: 'Vessel',
    getValue: ({ vessel }) =>
      vessel ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/vessels/${vessel.vesselCode}?isPre=0`}
        >
          {vessel.vesselCode} - {vessel.vesselName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'shipperId',
    label: 'Shipper',
    getValue: ({ shipper }) =>
      shipper ? (
        <ty.LinkText hover="false" to={`/directory/shippers/${shipper.id}`}>
          {shipper.id} - {shipper.shipperName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'containerId',
    label: 'Container ID',
    getValue: ({ containerId, container }) =>
      container ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/containers/${container.containerId}?containerView=pallets`}
        >
          {container.containerId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{containerId || '-'}</ty.BodyText>
      ),
  },
  {
    key: 'shipped',
    label: 'Shipped',
    getValue: ({ shipped }) => (
      <l.Flex alignCenter justifyBetween>
        <StatusIndicator status={shipped ? 'success' : 'error'} />
      </l.Flex>
    ),
  },
  {
    key: 'warehouse',
    label: 'Location',
    getValue: ({ warehouse }) =>
      warehouse ? (
        <ty.LinkText hover="false" to={`/directory/warehouses/${warehouse.id}`}>
          {warehouse.id} - {warehouse.warehouseName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'product',
    label: 'Species',
    getValue: (data) => (
      <ty.BodyText>
        {data.product?.species?.speciesDescription || ''}
      </ty.BodyText>
    ),
  },
  {
    key: 'product',
    label: 'Variety',
    getValue: (data) => (
      <ty.BodyText>
        {data.product?.variety?.varietyDescription || ''}
      </ty.BodyText>
    ),
  },
  {
    key: 'product',
    label: 'Size',
    getValue: (data) => (
      <ty.BodyText>
        {data.sizes?.nodes[0]?.combineDescription || ''}
      </ty.BodyText>
    ),
  },
  {
    key: 'product',
    label: 'Pack Type',
    getValue: (data) => (
      <ty.BodyText>
        {data.packType
          ? data.packType?.label?.labelName +
            ' - ' +
            data.packType?.packDescription
          : ''}
      </ty.BodyText>
    ),
  },
  {
    key: 'growerId',
    label: 'Grower',
  },
  {
    key: 'packDate',
    label: 'Pack Date',
  },
  {
    key: 'age',
    label: 'Age (Days)',
    getValue: ({ age }) => (
      <ty.BodyText>{age ? parseInt(age, 10) : ''}</ty.BodyText>
    ),
  },
  {
    key: 'currentBoxQuantity',
    label: 'Current Box Qty',
  },
  {
    key: 'receivedBoxQuantity',
    label: 'Received Box Qty',
  },
  {
    key: 'returnedBoxQuantity',
    label: 'Returned Box Qty',
  },
  {
    key: 'temperatureRecording',
    label: 'Temperature Recording',
  },
  {
    key: 'billOfLading',
    label: 'Bill Of Lading',
  },
  {
    key: 'volumeDiscountCode',
    label: 'Volume Discount Code',
  },
  {
    key: 'jvLotNumber',
    label: 'JV Lot Number',
  },
  {
    key: 'oldPackCode',
    label: 'Old Pack Code',
  },
  {
    key: 'filler',
    label: 'Filler',
  },
  {
    key: 'hatch',
    label: 'Hatch',
  },
  {
    key: 'deck',
    label: 'Deck',
  },
  {
    key: 'room',
    label: 'Room',
  },
  {
    key: 'section',
    label: 'Section',
  },
  {
    key: 'row',
    label: 'Row',
  },
];

export type PalletSectionLabelInfo = LabelInfo<PalletSection>;

export const sectionLabels: PalletSectionLabelInfo[] = [
  {
    key: 'varietyId',
    label: 'Variety',
    getValue: ({ variety }) => (
      <ty.BodyText>{variety ? variety.varietyDescription : ''}</ty.BodyText>
    ),
  },
  {
    key: 'sizeId',
    label: 'Size',
  },
  {
    key: 'growerId',
    label: 'Grower',
  },
  {
    key: 'boxQuantity',
    label: 'Box Quantity',
  },
  {
    key: 'packDate',
    label: 'Pack Date',
  },
];
