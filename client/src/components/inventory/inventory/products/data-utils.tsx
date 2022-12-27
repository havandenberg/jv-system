import { pluck, uniq } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { ProductMaster, ProductSize } from 'types';

export type ProductMasterLabelInfo = LabelInfo<ProductMaster>;

export const listLabels: ProductMasterLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
  },
  {
    key: 'species',
    label: 'Species',
    getValue: (data) => (data.species ? data.species.speciesDescription : '-'),
  },
  {
    key: 'variety',
    label: 'Variety',
    getValue: (data) => (data.variety ? data.variety.varietyDescription : '-'),
  },
  {
    key: 'sizes',
    label: 'Sizes',
    getValue: (data) =>
      data.sizes
        ? uniq(
            pluck('combineDescription', data.sizes.nodes as ProductSize[]),
          ).join(', ')
        : '-',
  },
  {
    key: 'packType',
    label: 'Pack Type',
    getValue: (data) => (data.packType ? data.packType.packDescription : '-'),
  },
];

export const baseLabels: ProductMasterLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
];
