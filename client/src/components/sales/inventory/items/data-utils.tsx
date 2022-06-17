import { LabelInfo } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { InventoryItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { isPreInventoryItem } from '../utils';

export type InventoryItemLabelInfo = LabelInfo<InventoryItem>;

export const indexListLabels = ({
  species,
  variety,
  packType,
  size,
  plu,
  shipper,
}: {
  species?: string;
  variety?: string;
  size?: string;
  packType?: string;
  plu?: string;
  shipper?: string;
}): InventoryItemLabelInfo[] => [
  {
    key: 'vessel',
    label: 'Vessel',
    getValue: ({ vessel }) =>
      vessel ? `${vessel.vesselCode} - ${vessel.vesselName}` : '',
    defaultSortOrder: SORT_ORDER.DESC,
    sortable: true,
    customSortBy: ({ vessel }) => (vessel ? vessel.vesselCode : ''),
  },
  {
    key: 'vessel',
    label: 'Available Date',
    getValue: ({ vessel }) => (vessel ? vessel.dischargeDate : ''),
    defaultSortOrder: SORT_ORDER.DESC,
    sortable: true,
    sortKey: 'dischargeDate',
    customSortBy: ({ vessel }) =>
      vessel ? new Date(vessel.dischargeDate.replace(/-/g, '/')) : '',
  },
  ...((!!shipper
    ? []
    : [
        {
          key: 'shipper',
          label: 'Shipper',
          getValue: (data) => data.shipper?.shipperName || '',
          defaultSortOrder: SORT_ORDER.ASC,
          sortable: true,
          customSortBy: (data) => data.shipper?.shipperName || '',
        },
      ]) as InventoryItemLabelInfo[]),
  {
    key: 'product',
    label: 'Details',
    getValue: ({ plu: pluVal, product }) => {
      const desc = `${
        (!species && product?.species?.speciesDescription) || ''
      } ${(!variety && product?.variety?.varietyDescription) || ''} ${
        (!size && product?.sizes?.nodes[0]?.jvDescription) || ''
      } ${
        (!packType && product?.packType
          ? product?.packType?.label?.labelName +
            ' - ' +
            product?.packType?.packDescription
          : '') || ''
      } ${!plu && pluVal ? 'PLU' : ''}`;
      return desc.trim() ? desc : undefined;
    },
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    sortKey: 'species',
    customSortBy: ({ plu, product }) =>
      `${product?.species?.speciesDescription || ''} ${
        product?.variety?.varietyDescription || ''
      } ${product?.sizes?.nodes[0]?.jvDescription || ''} ${
        product?.packType
          ? product?.packType?.label?.labelName +
            ' - ' +
            product?.packType?.packDescription
          : ''
      } ${plu ? 'PLU' : ''}`.toLowerCase(),
  },
  {
    key: 'palletsReceived',
    label: 'Received',
    sortable: true,
    defaultSortOrder: SORT_ORDER.DESC,
    customSortBy: ({ palletsReceived }) => palletsReceived,
    customStyles: {
      label: {
        textAlign: 'center',
        width: th.sizes.fill,
      },
    },
  },
  {
    key: 'palletsOnHand',
    label: 'On Hand',
    sortable: true,
    defaultSortOrder: SORT_ORDER.DESC,
    customSortBy: ({ palletsOnHand }) => palletsOnHand,
    customStyles: {
      label: {
        color: th.colors.brand.primaryAccent,
        textAlign: 'center',
        width: th.sizes.fill,
      },
    },
  },
  {
    key: 'palletsAvailable',
    label: 'Available',
    sortable: true,
    defaultSortOrder: SORT_ORDER.DESC,
    customSortBy: ({ palletsAvailable }) => palletsAvailable,
    customStyles: {
      label: {
        color: th.colors.status.successAlt,
        textAlign: 'center',
        width: th.sizes.fill,
      },
    },
    getValue: ({ palletsAvailable }) => (
      <ty.BodyText
        center
        color={
          parseInt(palletsAvailable, 10) < 0
            ? th.colors.status.error
            : th.colors.status.successAlt
        }
        width={th.sizes.fill}
      >
        {palletsAvailable}
      </ty.BodyText>
    ),
  },
  {
    key: 'id',
    label: 'PRE',
    sortKey: 'isPre',
    sortable: true,
    defaultSortOrder: SORT_ORDER.ASC,
    getValue: (item) => (
      <l.Flex alignCenter justifyCenter>
        {isPreInventoryItem(item) && <StatusIndicator status="warning" />}
      </l.Flex>
    ),
    customSortBy: (item) => (isPreInventoryItem(item) ? 'a' : 'z'),
  },
];

export const listLabels: InventoryItemLabelInfo[] = [
  {
    key: 'shipper',
    label: 'Shipper',
    getValue: (data) => data.shipper?.shipperName || '',
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    customSortBy: (data) => data.shipper?.shipperName || '',
  },
  {
    key: 'product',
    label: 'Species',
    getValue: (data) => data.product?.species?.speciesDescription || '',
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    sortKey: 'species',
    customSortBy: (data) => data.product?.species?.speciesDescription || '',
  },
  {
    key: 'product',
    label: 'Variety',
    getValue: (data) => data.product?.variety?.varietyDescription || '',
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    sortKey: 'variety',
    customSortBy: (data) => data.product?.variety?.varietyDescription || '',
  },
  {
    key: 'product',
    label: 'Size',
    getValue: (data) => data.product?.sizes?.nodes[0]?.jvDescription || '',
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    sortKey: 'size',
    customSortBy: (data) => data.product?.sizes?.nodes[0]?.jvDescription || '',
  },
  {
    key: 'product',
    label: 'Pack Type',
    getValue: ({ product }) =>
      product?.packType
        ? `${
            product.packType.label
              ? product.packType.label.labelName + ' - '
              : ''
          }${product.packType.packDescription}`
        : '',
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    sortKey: 'packType',
    customSortBy: (data) =>
      data.product?.packType
        ? data.product?.packType?.label?.labelName +
          ' - ' +
          data.product?.packType?.packDescription
        : '',
  },
  {
    key: 'plu',
    label: 'PLU',
    getValue: (data) => (data.plu ? 'PLU' : ''),
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    customSortBy: ({ plu }) => (plu ? 'a' : 'b'),
  },
  {
    key: 'palletsReceived',
    label: 'Received',
    sortable: true,
    defaultSortOrder: SORT_ORDER.DESC,
    customSortBy: ({ palletsReceived }) => palletsReceived,
  },
  {
    key: 'palletsOnHand',
    label: 'On Hand',
    getValue: ({ palletsOnHand }) => (
      <ty.Span color={th.colors.brand.primaryAccent}>{palletsOnHand}</ty.Span>
    ),
    sortable: true,
    defaultSortOrder: SORT_ORDER.DESC,
    customSortBy: ({ palletsOnHand }) => palletsOnHand,
    customStyles: {
      label: {
        color: th.colors.brand.primaryAccent,
      },
    },
  },
  {
    key: 'palletsAvailable',
    label: 'Available',
    getValue: ({ palletsAvailable }) => (
      <ty.Span
        color={
          parseInt(palletsAvailable, 10) < 0
            ? th.colors.status.error
            : th.colors.status.successAlt
        }
      >
        {palletsAvailable}
      </ty.Span>
    ),
    sortable: true,
    defaultSortOrder: SORT_ORDER.DESC,
    customSortBy: ({ palletsAvailable }) => palletsAvailable,
    customStyles: {
      label: {
        color: th.colors.status.successAlt,
      },
    },
  },
];

export const baseLabels: InventoryItemLabelInfo[] = [
  {
    key: 'vessel',
    label: 'Vessel Code',
    getValue: ({ vessel }) => (
      <ty.BodyText>
        {vessel ? (
          <l.Flex alignCenter>
            {vessel.isPre && (
              <l.Div mr={th.spacing.sm}>
                <StatusIndicator status="warning" />
              </l.Div>
            )}
            <ty.LinkText hover="false" to={`/sales/vessels/${vessel.id}`}>
              {vessel.vesselCode} - {vessel.vesselName}
            </ty.LinkText>
          </l.Flex>
        ) : (
          '-'
        )}
      </ty.BodyText>
    ),
  },
  {
    key: 'vessel',
    label: 'Available Date',
    getValue: ({ vessel }) => (
      <ty.BodyText>
        {vessel
          ? formatDate(new Date(vessel.dischargeDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'shipper',
    label: 'Shipper',
    getValue: ({ shipper }) => (
      <ty.BodyText>
        {shipper ? (
          <ty.LinkText hover="false" to={`/directory/shippers/${shipper.id}`}>
            {shipper.shipperName}
          </ty.LinkText>
        ) : (
          '-'
        )}
      </ty.BodyText>
    ),
  },
  {
    key: 'country',
    label: 'Country Of Origin',
    getValue: (data) => (
      <ty.BodyText>{data.country?.countryName || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'warehouse',
    label: 'Location',
    getValue: ({ coast, warehouse }) => (
      <ty.BodyText>
        {warehouse ? (
          <ty.LinkText
            hover="false"
            to={`/directory/warehouses/${warehouse.id}`}
          >
            {coast} - {warehouse.warehouseName}
          </ty.LinkText>
        ) : (
          '-'
        )}
      </ty.BodyText>
    ),
  },
  {
    key: 'product',
    label: 'Species',
    getValue: (data) => (
      <ty.BodyText>
        {data.product?.species?.speciesDescription || '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'product',
    label: 'Variety',
    getValue: (data) => (
      <ty.BodyText>
        {data.product?.variety?.varietyDescription || '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'product',
    label: 'Size',
    getValue: (data) => (
      <ty.BodyText>
        {data.product?.sizes?.nodes[0]?.jvDescription || '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'product',
    label: 'Pack Type',
    getValue: (data) => (
      <ty.BodyText>
        {data.product?.packType
          ? data.product?.packType?.label?.labelName +
            ' - ' +
            data.product?.packType?.packDescription
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'plu',
    label: 'PLU',
  },
  {
    key: 'jvLotNumber',
    label: 'JV Lot Number',
  },
  {
    key: 'specialLotNumber',
    label: 'Special Lot Number',
  },
  {
    key: 'storageRank',
    label: 'Storage Rank',
  },
  {
    key: 'palletsTransferredIn',
    label: 'Pallets Transferred In',
  },
  {
    key: 'palletsTransferredOut',
    label: 'Pallets Transferred Out',
  },
];

export const getFeaturedValues = (data: InventoryItem) => [
  {
    label: 'Received',
    values: [{ value: data.palletsReceived }],
  },
  {
    customStyles: {
      wrapper: {
        background: th.colors.brand.primaryAccent,
      },
    },
    label: 'On Hand',
    values: [{ value: data.palletsOnHand }],
  },
  {
    customStyles: {
      wrapper: {
        background:
          data.palletsAvailable < 0
            ? th.colors.status.error
            : th.colors.status.successAlt,
      },
    },
    label: 'Available',
    values: [{ value: data.palletsAvailable }],
  },
  {
    customStyles: {
      wrapper: {
        background: th.colors.brand.primaryAccent,
      },
    },
    label: 'Committed',
    values: [{ value: data.palletsCommitted }],
  },
  {
    label: 'Shipped',
    values: [{ value: data.palletsShipped }],
  },
];
