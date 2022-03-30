import ColorPicker from 'components/color-picker';
import { LabelInfo } from 'components/column-label';
import { CommonSpecies } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

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
    key: 'speciesDescription',
    label: 'Description',
  },
];

export const baseLabels: CommonSpeciesLabelInfo[] = [
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
    key: 'speciesDescription',
    label: 'Description',
  },
];
