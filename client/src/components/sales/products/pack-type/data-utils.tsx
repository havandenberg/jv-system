import { loader } from 'graphql.macro';
import { pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { CommonPackType, CommonPackTypeTag, PackMaster } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';

const PACK_MASTER_QUERY = loader(
  '../../../../api/sales/inventory/products/pack-masters/list.gql',
);

export type CommonPackTypeLabelInfo = LabelInfo<CommonPackType>;

export const listLabels: CommonPackTypeLabelInfo[] = [
  {
    key: 'packTypeName',
    label: 'Pack Type Name',
    sortable: true,
  },
  {
    key: 'packTypeDescription',
    label: 'Description',
  },
  {
    key: 'commonPackTypeTags',
    label: 'Tags',
    getValue: ({ commonPackTypeTags }) => (
      <ty.BodyText>
        {pluck(
          'tagText',
          commonPackTypeTags?.nodes as CommonPackTypeTag[],
        ).join(', ')}
      </ty.BodyText>
    ),
  },
];

export const baseLabels: CommonPackTypeLabelInfo[] = [
  {
    key: 'packTypeName',
    label: 'Name',
  },
  {
    key: 'packTypeDescription',
    label: 'Description',
  },
  {
    key: 'packMasterId',
    label: 'Code',
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
  },
];
