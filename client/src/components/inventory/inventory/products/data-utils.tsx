import { LabelInfo } from 'components/column-label';
import { ProductMaster } from 'types';

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
];

export const baseLabels: ProductMasterLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
];
