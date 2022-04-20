import React from 'react';
import { add, format, startOfISOWeek } from 'date-fns';
import { times } from 'ramda';

import DoubleArrowInCircle from 'assets/images/double-arrow-in-circle';
import PlusInCircle from 'assets/images/plus-in-circle';
import { useProgramsQueryParams } from 'hooks/use-query-params';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber, isCurrentWeek } from 'utils/date';

import { getGridProps } from './utils';

interface Props {
  collapseAllItems: () => void;
  editing: boolean;
  expandAllItems: () => void;
  increaseWeekCount: () => void;
  selectedWeekNumber: number;
  startDate: string;
  weekCount: number;
}

const Header = ({
  collapseAllItems,
  editing,
  expandAllItems,
  increaseWeekCount,
  selectedWeekNumber,
  startDate,
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
            <ty.BodyText>Products</ty.BodyText>
            {!editing && (
              <>
                <l.HoverButton
                  borderRadius={th.borderRadii.circle}
                  boxShadow={th.shadows.boxLight}
                  ml={th.spacing.sm}
                  onClick={collapseAllItems}
                >
                  <DoubleArrowInCircle
                    fill={th.colors.brand.primary}
                    height={th.sizes.xs}
                    width={th.sizes.xs}
                  />
                </l.HoverButton>
                <l.HoverButton
                  borderRadius={th.borderRadii.circle}
                  boxShadow={th.shadows.boxLight}
                  ml={th.spacing.sm}
                  onClick={expandAllItems}
                  transform="scaleY(-1)"
                >
                  <DoubleArrowInCircle
                    fill={th.colors.brand.primary}
                    height={th.sizes.xs}
                    width={th.sizes.xs}
                  />
                </l.HoverButton>
              </>
            )}
            {commonSpeciesId && (
              <l.HoverButton
                ml={th.spacing.lg}
                onClick={clearProductQueryParams}
              >
                <ty.SmallText>Clear product filters</ty.SmallText>
              </l.HoverButton>
            )}
          </l.Flex>
          <ty.BodyText mr={th.spacing.md}>Week</ty.BodyText>
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
