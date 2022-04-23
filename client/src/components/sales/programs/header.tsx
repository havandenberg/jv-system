import React from 'react';
import { add, format, startOfISOWeek } from 'date-fns';
import { times } from 'ramda';

import PlusInCircle from 'assets/images/plus-in-circle';
import { useProgramsQueryParams } from 'hooks/use-query-params';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber, isCurrentWeek } from 'utils/date';

import { getGridProps } from './utils';
import { LineItemCheckbox } from 'ui/checkbox';

interface Props {
  editing: boolean;
  increaseWeekCount: () => void;
  selectedWeekNumber: number;
  showAllocated: boolean;
  startDate: string;
  toggleShowAllocated: () => void;
  weekCount: number;
}

const Header = ({
  editing,
  increaseWeekCount,
  selectedWeekNumber,
  showAllocated,
  startDate,
  toggleShowAllocated,
  weekCount,
}: Props) => {
  const [{ commonSpeciesId }, setProgramsQueryParams] =
    useProgramsQueryParams();
  const { gridTemplateColumns, gridWidth } = getGridProps(weekCount);

  const clearProductQueryParams = () => {
    setProgramsQueryParams({
      commonSpeciesId: null,
      commonVarietyId: null,
      commonSizeId: null,
      commonPackTypeId: null,
      plu: null,
    });
  };

  return (
    <l.Div relative>
      <l.Grid
        alignCenter
        gridTemplateColumns={gridTemplateColumns}
        mt={th.spacing.lg}
      >
        <l.Flex alignCenter justifyBetween>
          <l.Flex alignCenter>
            <ty.BodyText bold mr={th.spacing.lg}>
              Products ↓
            </ty.BodyText>
            <LineItemCheckbox
              checked={showAllocated}
              label={
                <ty.SmallText mx={th.spacing.sm} nowrap>
                  Show allocated
                </ty.SmallText>
              }
              onChange={toggleShowAllocated}
            />
            {commonSpeciesId && (
              <l.HoverButton
                ml={th.spacing.md}
                onClick={clearProductQueryParams}
              >
                <ty.SmallText>Clear product filters</ty.SmallText>
              </l.HoverButton>
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
