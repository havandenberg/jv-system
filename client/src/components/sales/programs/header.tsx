import React from 'react';
import { add, format, startOfISOWeek } from 'date-fns';
import { times } from 'ramda';

import PlusInCircle from 'assets/images/plus-in-circle';
import { useProgramsQueryParams } from 'hooks/use-query-params';
import b from 'ui/button';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber, isCurrentWeek } from 'utils/date';

import { getGridProps } from './utils';

interface Props {
  editing: boolean;
  increaseWeekCount: () => void;
  isCustomers: boolean;
  hasPrograms: boolean;
  loading: boolean;
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
  selectedWeekNumber,
  showAllocated,
  startDate,
  toggleShowAllocated,
  weekCount,
}: Props) => {
  const [{ commonSpeciesId, customerIdFilter }, setProgramsQueryParams] =
    useProgramsQueryParams();
  const { gridTemplateColumns, gridWidth } = getGridProps(
    weekCount,
    isCustomers,
  );

  const clearProductQueryParams = () => {
    setProgramsQueryParams({
      commonSpeciesId: undefined,
      commonVarietyId: undefined,
      commonSizeId: undefined,
      commonPackTypeId: undefined,
      plu: undefined,
      customerIdFilter: undefined,
    });
  };

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
            {(commonSpeciesId || customerIdFilter) && !editing && (
              <b.Warning
                ml={th.spacing.lg}
                small
                onClick={clearProductQueryParams}
              >
                Clear filters
              </b.Warning>
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
          <ty.CaptionText secondary>Species</ty.CaptionText>
          <ty.CaptionText secondary>Variety</ty.CaptionText>
          <ty.CaptionText secondary>Size</ty.CaptionText>
          <ty.CaptionText secondary>Pack Type</ty.CaptionText>
          <ty.CaptionText secondary>PLU/GTIN</ty.CaptionText>
          {isCustomers ? null : (
            <ty.CaptionText secondary>Customer</ty.CaptionText>
          )}
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
