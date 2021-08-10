import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { add, format, startOfISOWeek } from 'date-fns';
import { times } from 'ramda';

import ArrowInCircle from 'assets/images/arrow-in-circle';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getCurrentWeekNumber, isCurrentWeek } from 'utils/date';

import { gridTemplateColumns } from '.';
import DoubleArrowInCircle from 'assets/images/double-arrow-in-circle';

const WeekArrowButton = styled(l.HoverButton)({
  position: 'absolute',
  borderRadius: '50%',
  boxShadow: th.shadows.boxLight,
  top: 14,
});

interface Props {
  collapseAllItems: () => void;
  editing: boolean;
  expandAllItems: () => void;
  handleWeekChange: (weeks: number) => void;
  selectedWeekNumber: number;
  startDate: string;
}

const Header = ({
  collapseAllItems,
  editing,
  expandAllItems,
  handleWeekChange,
  selectedWeekNumber,
  startDate,
}: Props) => {
  const showForwardArrow = selectedWeekNumber < getCurrentWeekNumber() + 3;

  const handleBackward = () => handleWeekChange(-1);
  const handleForward = () => handleWeekChange(1);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      if (event.code === 'ArrowRight' && showForwardArrow) handleForward();
      else if (event.code === 'ArrowLeft') handleBackward();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <l.Grid
      alignCenter
      gridTemplateColumns={`${th.sizes.icon} ${gridTemplateColumns}`}
      mt={th.spacing.sm}
    >
      <l.Div />
      <l.Flex alignCenter transform="translateX(-25px)">
        <ty.BodyText>Product</ty.BodyText>
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
      </l.Flex>
      <ty.BodyText center>Size</ty.BodyText>
      {times((i) => {
        const isFirst = i === 0;
        const isCurrentWeekVal = isCurrentWeek(selectedWeekNumber + i);
        const border = isCurrentWeekVal ? th.borders.disabled : undefined;
        return (
          <l.Flex
            alignCenter
            bg={
              isCurrentWeekVal ? th.colors.brand.containerBackground : undefined
            }
            border={border}
            column
            justifyCenter
            key={i}
            pb={th.spacing.sm}
            pt={th.spacing.xs}
          >
            <l.Flex alignCenter position="relative">
              {isFirst && (
                <WeekArrowButton left={-26} onClick={handleBackward}>
                  <ArrowInCircle
                    fill={th.colors.brand.primary}
                    height={th.sizes.xs}
                    width={th.sizes.xs}
                  />
                </WeekArrowButton>
              )}
              <ty.BodyText bold={isCurrentWeekVal} nowrap>
                {isFirst ? 'Week ' : ''}
                {selectedWeekNumber + i}
              </ty.BodyText>
              {isFirst && showForwardArrow && (
                <WeekArrowButton
                  onClick={handleForward}
                  transform="scaleX(-1)"
                  right={-26}
                >
                  <ArrowInCircle
                    fill={th.colors.brand.primary}
                    height={th.sizes.xs}
                    width={th.sizes.xs}
                  />
                </WeekArrowButton>
              )}
            </l.Flex>
            <ty.SmallText bold={isCurrentWeekVal} mt={th.spacing.tn} secondary>
              {format(
                startOfISOWeek(
                  add(new Date(startDate.replace(/-/g, '/')), {
                    weeks: 1 * i,
                  }),
                ),
                'MMM d',
              )}
            </ty.SmallText>
          </l.Flex>
        );
      }, 5)}
    </l.Grid>
  );
};

export default Header;
