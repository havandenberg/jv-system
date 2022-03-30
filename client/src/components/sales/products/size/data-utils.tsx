import { LabelInfo } from 'components/column-label';
import { CommonSize } from 'types';

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
];
