import ColorPicker from 'components/color-picker';
import { LabelInfo } from 'components/column-label';
import { CommonVariety } from 'types';

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
    key: 'varietyDescription',
    label: 'Description',
  },
];

export const baseLabels: CommonVarietyLabelInfo[] = [
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
    key: 'varietyDescription',
    label: 'Description',
  },
];
