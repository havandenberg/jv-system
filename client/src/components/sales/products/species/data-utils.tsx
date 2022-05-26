import { loader } from 'graphql.macro';
import { pluck } from 'ramda';

import ColorPicker from 'components/color-picker';
import { LabelInfo } from 'components/column-label';
import { inventorySortKeys } from 'components/sales/inventory/utils';
import { CommonSpecies, CommonSpeciesTag, ProductSpecies } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const PRODUCT_SPECIES_QUERY = loader(
  '../../../../api/sales/inventory/products/species/list.gql',
);

export type CommonSpeciesLabelInfo = LabelInfo<CommonSpecies>;

export const listLabels: (isIndex: boolean) => CommonSpeciesLabelInfo[] = (
  isIndex,
) => [
  ...((isIndex
    ? []
    : [
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
      ]) as CommonSpeciesLabelInfo[]),
  {
    key: 'speciesName',
    label: isIndex ? 'Category/Species Name' : 'Species Name',
    sortable: true,
    getValue: ({ speciesName, uiColor }) =>
      isIndex ? (
        <l.Flex ml={th.spacing.lg}>
          <ColorPicker
            activeColor={uiColor || ''}
            color={uiColor || ''}
            onChange={() => ({})}
            readOnly
          />
          <ty.BodyText ml={th.spacing.md}>{speciesName}</ty.BodyText>
        </l.Flex>
      ) : (
        <ty.BodyText>{speciesName}</ty.BodyText>
      ),
  },
  {
    key: 'productSpeciesId',
    label: 'Primary Code',
  },
  {
    key: 'commonSpeciesTags',
    label: 'Tags',
    getValue: ({ commonSpeciesTags }) => {
      const tagString = pluck(
        'tagText',
        commonSpeciesTags?.nodes as CommonSpeciesTag[],
      ).join(', ');
      return tagString ? <ty.BodyText>{tagString}</ty.BodyText> : null;
    },
  },
  {
    key: 'speciesDescription',
    label: 'Description',
  },
];

export const baseLabels: (
  productSpecieses: ProductSpecies[],
) => CommonSpeciesLabelInfo[] = (productSpecieses) => [
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
    key: 'speciesName',
    label: 'Name',
  },
  {
    key: 'productSpeciesId',
    label: 'Primary Code',
    itemSelectorQueryProps: {
      errorLabel: 'species',
      getItemContent: ({ id, speciesDescription }: ProductSpecies) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {speciesDescription}
        </ty.BodyText>
      ),
      query: PRODUCT_SPECIES_QUERY,
      queryName: 'productSpecieses',
    },
    validate: ({ productSpeciesId }) =>
      !productSpeciesId ||
      !!productSpecieses.find(({ id }) => id === productSpeciesId),
  },
  {
    key: 'defaultInvSortKey',
    label: 'Inv Sort Key',
    dropdownOptions: inventorySortKeys,
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
    key: 'speciesDescription',
    label: 'Description',
  },
];
