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
  selectedWeekNumber: number;
  showAllocated: boolean;
  startDate: string;
  toggleShowAllocated: () => void;
  weekCount: number;
}

const Header = ({
  editing,
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
      position="sticky"
      top={0}
      zIndex={5}
      width={gridWidth}
    >
      <l.Grid
        alignCenter
        gridTemplateColumns={gridTemplateColumns}
        pt={th.spacing.lg}
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
                    Show allocated
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
      )}
    </l.Div>
  );
};

export default Header;
