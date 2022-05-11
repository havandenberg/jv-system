import { loader } from 'graphql.macro';
import { pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { inventorySortKeys } from 'components/sales/inventory/utils';
import { CommonSize, CommonSizeTag, ProductSize } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';

const PRODUCT_SIZE_QUERY = loader(
  '../../../../api/sales/inventory/products/sizes/list.gql',
);

export type CommonSizeLabelInfo = LabelInfo<CommonSize>;

export const listLabels: CommonSizeLabelInfo[] = [
  {
    key: 'sizeName',
    label: 'Size Name',
    sortable: true,
  },
  {
    key: 'sizeDescription',
    label: 'Description',
  },
  {
    key: 'commonSizeTags',
    label: 'Tags',
    getValue: ({ commonSizeTags }) => (
      <ty.BodyText>
        {pluck('tagText', commonSizeTags?.nodes as CommonSizeTag[]).join(', ')}
      </ty.BodyText>
    ),
  },
];

export const baseLabels: CommonSizeLabelInfo[] = [
  {
    key: 'sizeName',
    label: 'Name',
  },
  {
    key: 'sizeDescription',
    label: 'Description',
  },
  {
    key: 'productSizeId',
    label: 'Primary Code',
    itemSelectorQueryProps: {
      errorLabel: 'sizes',
      getItemContent: ({ id, jvDescription }: ProductSize) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {jvDescription}
        </ty.BodyText>
      ),
      query: PRODUCT_SIZE_QUERY,
      queryName: 'productSizes',
    },
  },
  {
    key: 'defaultInvSortKey',
    label: 'Inv Sort Key',
    dropdownOptions: inventorySortKeys.filter((item) => item.value !== 'size'),
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
];
