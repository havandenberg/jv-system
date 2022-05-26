import ColorPicker from 'components/color-picker';
import { LabelInfo } from 'components/column-label';
import { CommonCategory } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export type CommonCategoryLabelInfo = LabelInfo<CommonCategory>;

export const listLabels: CommonCategoryLabelInfo[] = [
  {
    key: 'categoryName',
    label: 'Category Name',
    getValue: ({ categoryName, uiColor }) => (
      <l.Flex>
        <ColorPicker
          activeColor={uiColor || ''}
          color={uiColor || ''}
          onChange={() => ({})}
          readOnly
        />
        <ty.BodyText bold ml={th.spacing.md}>
          {categoryName}
        </ty.BodyText>
      </l.Flex>
    ),
  },
  {
    key: 'id',
    label: '',
    getValue: () => <div />,
  },
  {
    key: 'nodeId',
    label: '',
    getValue: () => <div />,
  },
  {
    key: 'categoryDescription',
    label: 'Description',
  },
];

export const baseLabels: CommonCategoryLabelInfo[] = [
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
    key: 'categoryName',
    label: 'Name',
  },
  {
    key: 'categoryDescription',
    label: 'Description',
  },
];
