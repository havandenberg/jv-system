import { loader } from 'graphql.macro';
import { pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { inventorySortKeys } from 'components/inventory/inventory/utils';
import {
  CommonPackType,
  CommonPackTypeTag,
  PackMaster,
  RepackStyle,
} from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';

const PACK_MASTER_QUERY = loader(
  '../../../../api/inventory/inventory/products/pack-masters/list.gql',
);
const REPACK_STYLE_QUERY = loader(
  '../../../../api/inventory/inventory/products/repack-styles/list.gql',
);

export type CommonPackTypeLabelInfo = LabelInfo<CommonPackType>;
export type RepackStyleLabelInfo = LabelInfo<RepackStyle>;

export const listLabels: CommonPackTypeLabelInfo[] = [
  {
    key: 'packTypeName',
    label: 'Pack Type Name',
    sortable: true,
  },
  {
    key: 'packMasterId',
    label: 'Primary Code',
  },
  {
    key: 'commonPackTypeTags',
    label: 'Tags',
    getValue: ({ commonPackTypeTags }) => {
      const tagString = pluck(
        'tagText',
        commonPackTypeTags?.nodes as CommonPackTypeTag[],
      ).join(', ');
      return tagString ? <ty.BodyText>{tagString}</ty.BodyText> : null;
    },
  },
  {
    key: 'packTypeDescription',
    label: 'Description',
  },
  {
    key: 'repackStyleId',
    label: 'Repack Style',
    getValue: ({ repackStyle }) => (
      <ty.BodyText>{repackStyle?.id || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'palletWeight',
    label: 'Pallet Weight (lbs)',
    getValue: ({ palletWeight }) => (
      <ty.BodyText>{palletWeight?.toLocaleString() || '-'}</ty.BodyText>
    ),
  },
];

export const baseLabels: (
  packMasters: PackMaster[],
  repackStyles: RepackStyle[],
) => CommonPackTypeLabelInfo[] = (packMasters, repackStyles) => [
  {
    key: 'packTypeName',
    label: 'Name',
  },
  {
    key: 'packMasterId',
    label: 'Primary Code',
    itemSelectorQueryProps: {
      errorLabel: 'pack types',
      getItemContent: ({ id, packDescription }: PackMaster) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {packDescription}
        </ty.BodyText>
      ),
      query: PACK_MASTER_QUERY,
      queryName: 'packMasters',
    },
    validate: ({ packMasterId }) =>
      !packMasterId || !!packMasters.find(({ id }) => id === packMasterId),
  },
  {
    key: 'defaultInvSortKey',
    label: 'Inv Sort Key',
    dropdownOptions: inventorySortKeys.filter(
      (item) => item.value !== 'packType',
    ),
    getValue: ({ defaultInvSortKey }) => {
      const selectedKey = inventorySortKeys.find(
        ({ value }) => value === defaultInvSortKey,
      );
      return (
        <ty.BodyText>
          {selectedKey
            ? selectedKey.value
              ? selectedKey.content || selectedKey.value
              : 'Default'
            : defaultInvSortKey || 'Default'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'packTypeDescription',
    label: 'Description',
  },
  {
    key: 'repackStyleId',
    label: 'Repack',
    itemSelectorQueryProps: {
      errorLabel: 'repack styles',
      getItemContent: ({ id, styleDescription }: RepackStyle) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {styleDescription}
        </ty.BodyText>
      ),
      offset: -142,
      query: REPACK_STYLE_QUERY,
      queryName: 'repackStyles',
      width: 350,
    },
    validate: ({ repackStyleId }) =>
      !repackStyleId || !!repackStyles.find(({ id }) => id === repackStyleId),
  },
  {
    key: 'boxCount',
    label: 'Box Count',
    getValue: ({ boxCount }) => <ty.BodyText>{boxCount || '-'}</ty.BodyText>,
    validate: ({ boxCount }) => !boxCount || !isNaN(Number(boxCount)),
  },
  {
    key: 'palletWeight',
    label: 'Pallet Weight (lbs)',
    getValue: ({ palletWeight }) => (
      <ty.BodyText>{palletWeight?.toLocaleString() || '-'}</ty.BodyText>
    ),
    validate: ({ palletWeight }) =>
      !palletWeight || !isNaN(Number(palletWeight)),
  },
];

export const repackStyleBaseLabels: RepackStyleLabelInfo[] = [
  {
    key: 'id',
    label: 'Repack Code',
  },
  {
    key: 'styleName',
    label: 'Short Desc',
  },
  {
    key: 'styleDescription',
    label: 'Long Desc',
  },
  {
    key: 'lqdCode',
    label: 'LQD Code',
  },
  {
    key: 'filmLength',
    label: 'Film Length',
  },
  {
    key: 'packOutWeight',
    label: 'Box Weight (lbs)',
  },
];
