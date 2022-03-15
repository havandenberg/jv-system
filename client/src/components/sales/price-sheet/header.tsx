import React from 'react';
import { add, format, startOfISOWeek } from 'date-fns';
import { times } from 'ramda';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber, isCurrentWeek } from 'utils/date';

import { gridTemplateColumns } from '.';
import DoubleArrowInCircle from 'assets/images/double-arrow-in-circle';

interface Props {
  collapseAllItems: () => void;
  editing: boolean;
  expandAllItems: () => void;
  selectedWeekNumber: number;
  startDate: string;
}

const Header = ({
  collapseAllItems,
  editing,
  expandAllItems,
  selectedWeekNumber,
  startDate,
}: Props) => (
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
            isCurrentWeekVal ? th.colors.brand.containerBackground : undefined
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
              {isFirst ? 'Week ' : ''}
              {displayedWeekNumber}
            </ty.BodyText>
          </l.Flex>
          <ty.SmallText bold={isCurrentWeekVal} mt={th.spacing.tn} secondary>
            {format(startOfWeek, 'MMM d')}
          </ty.SmallText>
        </l.Flex>
      );
    }, 5)}
  </l.Grid>
);

export default Header;
