import { loader } from 'graphql.macro';
import { pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { inventorySortKeys } from 'components/inventory/inventory/utils';
import { CommonSize, CommonSizeTag, ProductSize } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';

const PRODUCT_SIZE_QUERY = loader(
  '../../../../api/inventory/inventory/products/sizes/list.gql',
);

export type CommonSizeLabelInfo = LabelInfo<CommonSize>;

export const listLabels: CommonSizeLabelInfo[] = [
  {
    key: 'sizeName',
    label: 'Size Name',
    sortable: true,
  },
  {
    key: 'productSizeId',
    label: 'Primary Code',
  },
  {
    key: 'commonSizeTags',
    label: 'Tags',
    getValue: ({ commonSizeTags }) => {
      const tagString = pluck(
        'tagText',
        commonSizeTags?.nodes as CommonSizeTag[],
      ).join(', ');
      return tagString ? <ty.BodyText>{tagString}</ty.BodyText> : null;
    },
  },
  {
    key: 'sizeDescription',
    label: 'Description',
  },
];

export const baseLabels: (
  productSizes: ProductSize[],
) => CommonSizeLabelInfo[] = (productSizes) => [
  {
    key: 'sizeName',
    label: 'Name',
  },
  {
    key: 'productSizeId',
    label: 'Primary Code',
    itemSelectorQueryProps: {
      errorLabel: 'sizes',
      getItemContent: ({ id, combineDescription }: ProductSize) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {combineDescription}
        </ty.BodyText>
      ),
      query: PRODUCT_SIZE_QUERY,
      queryName: 'productSizes',
    },
    validate: ({ productSizeId }) =>
      !productSizeId || !!productSizes.find(({ id }) => id === productSizeId),
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
  {
    key: 'sizeDescription',
    label: 'Description',
  },
];
