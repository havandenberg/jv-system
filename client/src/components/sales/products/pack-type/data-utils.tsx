import { LabelInfo } from 'components/column-label';
import { CommonPackType } from 'types';

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
];
