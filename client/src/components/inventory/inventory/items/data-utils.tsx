import React from 'react';

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
  secondaryDetailsIndex,
  isTotal,
}: {
  species?: string;
  variety?: string;
  size?: string;
  packType?: string;
  plu?: string;
  shipper?: string;
  secondaryDetailsIndex?: string;
  isTotal?: boolean;
}): InventoryItemLabelInfo[] => [
  {
    key: 'vessel',
    label: 'Vessel',
    getValue: ({ vessel }) =>
      vessel ? `${vessel.vesselCode} - ${vessel.vesselName}` : '',
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    customSortBy: ({ shipper, vessel }) =>
      vessel && shipper
        ? `${vessel.vesselName} ${new Date(
            vessel.dischargeDate.replace(/-/g, '/'),
          ).getTime()} ${shipper.shipperName}`
        : '',
  },
  {
    key: 'dischargeDate' as keyof InventoryItem,
    label: 'Available Date',
    getValue: ({ vessel }) => (vessel ? vessel.dischargeDate : ''),
    defaultSortOrder: SORT_ORDER.ASC,
    sortable: true,
    sortKey: 'dischargeDate',
    customSortBy: ({ shipper, vessel }) =>
      vessel && shipper
        ? `${new Date(vessel.dischargeDate.replace(/-/g, '/')).getTime()} ${
            vessel.vesselName
          } ${shipper.shipperName}`
        : '',
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
          customSortBy: ({ shipper, vessel }) =>
            shipper && vessel
              ? `${shipper.shipperName} ${new Date(
                  vessel.dischargeDate.replace(/-/g, '/'),
                ).getTime()} ${vessel.vesselName}`
              : '',
        },
      ]) as InventoryItemLabelInfo[]),
  ...((!!secondaryDetailsIndex || isTotal
    ? [
        {
          key: 'product',
          label: isTotal ? 'Species' : 'Details',
          getValue: ({ plu: pluVal, product }) => {
            const desc = `${
              ((!species || (isTotal && !secondaryDetailsIndex)) &&
                product?.species?.speciesDescription) ||
              ''
            } ${
              (!variety &&
                secondaryDetailsIndex &&
                product?.variety?.varietyDescription) ||
              ''
            } ${
              (!size &&
                secondaryDetailsIndex &&
                product?.sizes?.nodes[0]?.combineDescription) ||
              ''
            } ${
              (!packType && secondaryDetailsIndex && product?.packType
                ? product?.packType?.label?.labelName +
                  ' ' +
                  product?.packType?.packDescription
                : '') || ''
            } ${!plu && secondaryDetailsIndex && pluVal ? 'PLU' : ''}`;
            return desc.trim() ? desc : undefined;
          },
          defaultSortOrder: SORT_ORDER.ASC,
          sortable: true,
          sortKey: 'species',
          customSortBy: ({ plu, product }) =>
            `${product?.species?.speciesDescription || ''} ${
              product?.variety?.varietyDescription || ''
            } ${product?.sizes?.nodes[0]?.combineDescription || ''} ${
              product?.packType
                ? product?.packType?.label?.labelName +
                  ' - ' +
                  product?.packType?.packDescription
                : ''
            } ${plu ? 'PLU' : ''}`.toLowerCase(),
        },
      ]
    : []) as InventoryItemLabelInfo[]),
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

export const listLabels: (
  secondaryDetailsIndex?: string,
) => InventoryItemLabelInfo[] = (secondaryDetailsIndex) => [
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
  ...((secondaryDetailsIndex
    ? [
        {
          key: 'product',
          label: 'Variety',
          getValue: (data) => data.product?.variety?.varietyDescription || '',
          defaultSortOrder: SORT_ORDER.ASC,
          sortable: true,
          sortKey: 'variety',
          customSortBy: (data) =>
            data.product?.variety?.varietyDescription || '',
        },
        {
          key: 'product',
          label: 'Size',
          getValue: (data) =>
            data.product?.sizes?.nodes[0]?.combineDescription || '',
          defaultSortOrder: SORT_ORDER.ASC,
          sortable: true,
          sortKey: 'size',
          customSortBy: (data) =>
            data.product?.sizes?.nodes[0]?.combineDescription || '',
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
      ]
    : []) as InventoryItemLabelInfo[]),
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
            <ty.LinkText
              hover="false"
              to={`/inventory/vessels/${vessel.vesselCode}`}
            >
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
    getValue: ({ product }) => {
      const commonSpecies = product?.species?.commonSpecies;
      const value = product?.species?.speciesDescription || '-';
      return (
        <ty.BodyText>
          {commonSpecies ? (
            <ty.LinkText
              hover="false"
              to={`/inventory/products/${commonSpecies.id}`}
            >
              {value}
            </ty.LinkText>
          ) : (
            value
          )}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'product',
    label: 'Variety',
    getValue: ({ product }) => {
      const commonSpecies = product?.species?.commonSpecies;
      const commonVariety = product?.variety?.commonVariety;
      const value = product?.variety?.varietyDescription || '-';
      return (
        <ty.BodyText>
          {commonSpecies && commonVariety ? (
            <ty.LinkText
              hover="false"
              to={`/inventory/products/${commonSpecies.id}/varieties/${commonVariety.id}`}
            >
              {value}
            </ty.LinkText>
          ) : (
            value
          )}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'product',
    label: 'Size',
    getValue: ({ product }) => {
      const commonSpecies = product?.species?.commonSpecies;
      const commonSize = product?.sizes?.nodes[0]?.commonSize;
      const value = product?.sizes?.nodes[0]?.combineDescription || '-';
      return (
        <ty.BodyText>
          {commonSpecies && commonSize ? (
            <ty.LinkText
              hover="false"
              to={`/inventory/products/${commonSpecies.id}/sizes/${commonSize.id}`}
            >
              {value}
            </ty.LinkText>
          ) : (
            value
          )}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'product',
    label: 'Pack Type',
    getValue: ({ product }) => {
      const commonSpecies = product?.species?.commonSpecies;
      const commonPackType = product?.packType?.commonPackType;
      const value = product?.packType
        ? product?.packType?.label?.labelName +
          ' - ' +
          product?.packType?.packDescription
        : '-';
      return (
        <ty.BodyText>
          {commonSpecies && commonPackType ? (
            <ty.LinkText
              hover="false"
              to={`/inventory/products/${commonSpecies.id}/packTypes/${commonPackType.id}`}
            >
              {value}
            </ty.LinkText>
          ) : (
            value
          )}
        </ty.BodyText>
      );
    },
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
  {
    key: 'product',
    label: 'Customer Program',
    getValue: (data) => (
      <ty.BodyText>
        {data.product?.packType?.customerSpecial?.customerName || '-'}
      </ty.BodyText>
    ),
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
