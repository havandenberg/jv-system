import { loader } from 'graphql.macro';
import { pluck } from 'ramda';

import ColorPicker from 'components/color-picker';
import { LabelInfo } from 'components/column-label';
import { inventorySortKeys } from 'components/sales/inventory/utils';
import { CommonVariety, CommonVarietyTag, ProductVariety } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';

const PRODUCT_VARIETY_QUERY = loader(
  '../../../../api/sales/inventory/products/varieties/list.gql',
);

export type CommonVarietyLabelInfo = LabelInfo<CommonVariety>;

export const listLabels: CommonVarietyLabelInfo[] = [
  {
    key: 'uiColor',
    label: 'UI Color',
    getValue: ({ uiColor }) => (
      <ColorPicker
        activeColor={uiColor || ''}
        color={uiColor || ''}
        onChange={() => ({})}
        readOnly
      />
    ),
  },
  {
    key: 'varietyName',
    label: 'Variety Name',
    sortable: true,
  },
  {
    key: 'productVarietyId',
    label: 'Primary Code',
  },
  {
    key: 'commonVarietyTags',
    label: 'Tags',
    getValue: ({ commonVarietyTags }) => {
      const tagString = pluck(
        'tagText',
        commonVarietyTags?.nodes as CommonVarietyTag[],
      ).join(', ');
      return tagString ? <ty.BodyText>{tagString}</ty.BodyText> : null;
    },
  },
  {
    key: 'varietyDescription',
    label: 'Description',
  },
];

export const baseLabels: (
  productVarieties: ProductVariety[],
) => CommonVarietyLabelInfo[] = (productVarieties) => [
  {
    key: 'uiColor',
    label: 'UI Color',
    getValue: ({ uiColor }) => (
      <ColorPicker
        activeColor={uiColor || ''}
        color={uiColor || ''}
        onChange={() => ({})}
        readOnly
      />
    ),
    isColor: true,
  },
  {
    key: 'varietyName',
    label: 'Name',
  },
  {
    key: 'productVarietyId',
    label: 'Primary Code',
    itemSelectorQueryProps: {
      errorLabel: 'varieties',
      getItemContent: ({ id, varietyDescription }: ProductVariety) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {varietyDescription}
        </ty.BodyText>
      ),
      query: PRODUCT_VARIETY_QUERY,
      queryName: 'productVarieties',
    },
    validate: ({ productVarietyId }) =>
      !productVarietyId ||
      !!productVarieties.find(({ id }) => id === productVarietyId),
  },
  {
    key: 'defaultInvSortKey',
    label: 'Inv Sort Key',
    dropdownOptions: inventorySortKeys.filter(
      (item) => item.value !== 'variety',
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
    key: 'varietyDescription',
    label: 'Description',
  },
];
