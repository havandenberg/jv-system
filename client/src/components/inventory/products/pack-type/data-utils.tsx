import { loader } from 'graphql.macro';
import { pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { inventorySortKeys } from 'components/inventory/inventory/utils';
import { CommonPackType, CommonPackTypeTag, PackMaster } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';

const PACK_MASTER_QUERY = loader(
  '../../../../api/inventory/inventory/products/pack-masters/list.gql',
);

export type CommonPackTypeLabelInfo = LabelInfo<CommonPackType>;

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
    key: 'isRepack',
    label: 'Repack',
    getValue: ({ isRepack }) => (
      <ty.BodyText>{isRepack ? 'Yes' : '-'}</ty.BodyText>
    ),
  },
];

export const baseLabels: (
  packMasters: PackMaster[],
) => CommonPackTypeLabelInfo[] = (packMasters) => [
  {
    key: 'packTypeName',
    label: 'Name',
  },
  {
    key: 'packMasterId',
    label: 'Primary Code',
    itemSelectorQueryProps: {
      errorLabel: 'sizes',
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
    key: 'isRepack',
    label: 'Repack',
    isBoolean: true,
    getValue: ({ isRepack }) => (
      <ty.BodyText>{!!isRepack ? 'Yes' : '-'}</ty.BodyText>
    ),
  },
];
