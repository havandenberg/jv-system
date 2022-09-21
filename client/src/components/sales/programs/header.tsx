import React from 'react';
import { add, format, startOfISOWeek } from 'date-fns';
import { Ord, times } from 'ramda';

import PlusInCircle from 'assets/images/plus-in-circle';
import { LabelInfo } from 'components/column-label';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { ShipperProgram, CustomerProgram } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber, isCurrentWeek } from 'utils/date';

import { getGridProps } from './utils';

interface ProgramFilterOptions {
  speciesOptions: string[];
  varietyOptions: string[];
  sizeOptions: string[];
  packTypeOptions: string[];
  customerOptions: string[];
}

const listLabels: (
  options: ProgramFilterOptions,
  isCustomers: boolean,
  customOptionsSort: (opt: string) => Ord,
) => LabelInfo<ShipperProgram | CustomerProgram>[] = (
  {
    speciesOptions,
    varietyOptions,
    sizeOptions,
    packTypeOptions,
    customerOptions,
  },
  isCustomers,
  customOptionsSort,
) => [
  {
    label: 'Species',
    key: 'commonSpeciesId',
    filterable: true,
    filterPanelProps: { customOptions: speciesOptions, customOptionsSort },
  },
  {
    label: 'Variety',
    key: 'commonVarietyId',
    filterable: true,
    filterPanelProps: { customOptions: varietyOptions, customOptionsSort },
  },
  {
    label: 'Size',
    key: 'commonSizeId',
    filterable: true,
    filterPanelProps: { customOptions: sizeOptions, customOptionsSort },
  },
  {
    label: 'Pack Type',
    key: 'commonPackTypeId',
    filterable: true,
    filterPanelProps: { customOptions: packTypeOptions, customOptionsSort },
  },
  {
    label: 'PLU/GTIN',
    key: 'plu',
  },
  ...((isCustomers
    ? []
    : [
        {
          label: 'Customer',
          key: 'customerId',
          sortKey: 'customerIdFilter',
          filterable: true,
          filterPanelProps: { customOptions: customerOptions },
        },
      ]) as LabelInfo<ShipperProgram | CustomerProgram>[]),
];

interface Props {
  editing: boolean;
  increaseWeekCount: () => void;
  isCustomers: boolean;
  hasPrograms: boolean;
  loading: boolean;
  programs: (ShipperProgram | CustomerProgram)[];
  selectedWeekNumber: number;
  showAllocated: boolean;
  startDate: string;
  toggleShowAllocated: () => void;
  weekCount: number;
}

const Header = ({
  editing,
  hasPrograms,
  loading,
  increaseWeekCount,
  isCustomers,
  programs,
  selectedWeekNumber,
  showAllocated,
  startDate,
  toggleShowAllocated,
  weekCount,
}: Props) => {
  const { gridTemplateColumns, gridWidth } = getGridProps(
    weekCount,
    isCustomers,
  );

  const getNewOptions = (currentOptions: string[], newOptions: string[]) => [
    ...currentOptions,
    ...(newOptions
      .map((opt) => (currentOptions.includes(opt) ? undefined : opt))
      .filter((opt) => !!opt) as string[]),
  ];

  const filterOptions = programs.reduce<{
    speciesOptions: string[];
    varietyOptions: string[];
    sizeOptions: string[];
    packTypeOptions: string[];
    customerOptions: string[];
  }>(
    (acc, prog) => ({
      speciesOptions: getNewOptions(acc.speciesOptions, [
        prog.commonSpecies?.speciesName || '',
        ...((prog.commonSpecies?.commonSpeciesTags?.nodes || []).map(
          (tag) => `${tag?.tagText} (tag)`,
        ) as string[]),
      ]),
      varietyOptions: getNewOptions(acc.varietyOptions, [
        prog.commonVariety?.varietyName || '',
        ...((prog.commonVariety?.commonVarietyTags?.nodes || []).map(
          (tag) => `${tag?.tagText} (tag)`,
        ) as string[]),
      ]),
      sizeOptions: getNewOptions(acc.sizeOptions, [
        prog.commonSize?.sizeName || '',
        ...((prog.commonSize?.commonSizeTags?.nodes || []).map(
          (tag) => `${tag?.tagText} (tag)`,
        ) as string[]),
      ]),
      packTypeOptions: getNewOptions(acc.packTypeOptions, [
        prog.commonPackType?.packTypeName || '',
        ...((prog.commonPackType?.commonPackTypeTags?.nodes || []).map(
          (tag) => `${tag?.tagText} (tag)`,
        ) as string[]),
      ]),
      customerOptions: getNewOptions(acc.customerOptions, [
        prog.customer?.customerName || '',
      ]),
    }),
    {
      speciesOptions: [],
      varietyOptions: [],
      sizeOptions: [],
      packTypeOptions: [],
      customerOptions: [],
    },
  );

  const columnLabels = useColumns<ShipperProgram | CustomerProgram>(
    'commonSpeciesId',
    SORT_ORDER.ASC,
    listLabels(filterOptions, isCustomers, (option) =>
      option.includes(' (tag)') ? `A-${option}` : `B-${option}`,
    ),
    'product',
    isCustomers ? 'customer_program' : 'shipper_program',
  );

  return (
    <l.Div
      bg={th.colors.background}
      borderRight={th.borders.transparent}
      position="sticky"
      top={0}
      zIndex={5}
      width={gridWidth}
    >
      <l.Grid
        alignCenter
        gridTemplateColumns={gridTemplateColumns}
        pt={th.spacing.md}
      >
        <l.Flex alignCenter justifyBetween>
          <l.Flex alignCenter>
            <ty.BodyText bold mr={th.spacing.lg}>
              Products ↓
            </ty.BodyText>
            {!editing && (
              <LineItemCheckbox
                checked={showAllocated}
                label={
                  <ty.SmallText mx={th.spacing.sm} nowrap>
                    Show details
                  </ty.SmallText>
                }
                onChange={toggleShowAllocated}
              />
            )}
          </l.Flex>
          <ty.BodyText bold mr={th.spacing.md}>
            Weeks →
          </ty.BodyText>
        </l.Flex>
        {times((i) => {
          const isFirst = i === 0;
          const isCurrentWeekVal = isCurrentWeek(selectedWeekNumber + i);
          const startOfWeek = startOfISOWeek(
            add(new Date(startDate.replace(/-/g, '/')), {
              weeks: 1 * i,
            }),
          );
          const displayedWeekNumber = getWeekNumber(startOfWeek);
          return (
            <l.Flex
              alignCenter
              bg={
                isCurrentWeekVal
                  ? th.colors.brand.containerBackground
                  : undefined
              }
              borderTop={th.borders.disabled}
              borderBottom={th.borders.disabled}
              borderRight={th.borders.disabled}
              borderLeft={isFirst ? th.borders.disabled : undefined}
              column
              justifyCenter
              key={i}
              pb={th.spacing.sm}
              pt={th.spacing.xs}
            >
              <l.Flex alignCenter relative>
                <ty.BodyText bold={isCurrentWeekVal} nowrap>
                  {displayedWeekNumber}
                </ty.BodyText>
              </l.Flex>
              <ty.SmallText
                bold={isCurrentWeekVal}
                mt={th.spacing.tn}
                secondary
              >
                {format(startOfWeek, 'MMM d')}
              </ty.SmallText>
            </l.Flex>
          );
        }, weekCount)}
      </l.Grid>
      {editing && (
        <l.HoverButton
          onClick={increaseWeekCount}
          position="absolute"
          top={`-${th.sizes.icon}`}
          left={`calc(${gridWidth}px - ${th.spacing.md})`}
        >
          <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
      )}{' '}
      <l.Grid
        bg={th.colors.white}
        gridColumnGap={th.spacing.sm}
        gridTemplateColumns={gridTemplateColumns}
        py={th.spacing.sm}
      >
        <l.Grid
          gridColumnGap={th.spacing.xs}
          gridTemplateColumns={`repeat(2, 1fr) repeat(3, 0.7fr)${
            isCustomers ? '' : ' 1fr'
          }`}
          marginLeft={52}
          relative
        >
          {columnLabels}
          {(hasPrograms || editing) && !loading && (
            <l.Div
              borderTop={th.borders.secondary}
              position="absolute"
              left={-52}
              bottom={`-${th.spacing.sm}`}
              width={gridWidth}
            />
          )}
        </l.Grid>
      </l.Grid>
    </l.Div>
  );
};

export default Header;
