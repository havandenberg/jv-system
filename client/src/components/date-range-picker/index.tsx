import React, { useState } from 'react';
import 'react-date-range/dist/styles.css';
import './styles.css';
import styled from '@emotion/styled';
import { format, getISOWeek } from 'date-fns';
import {
  DateRangePicker as DateRange,
  DateRangePickerProps,
} from 'react-date-range';

import CalendarImg from 'assets/images/calendar';
import CloseImg from 'assets/images/close';
import useOutsideClickRef from 'hooks/use-outside-click-ref';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Div)({ position: 'relative', zIndex: 10 });

const Control = styled(l.Flex)(
  ({ hasValue, show }: { hasValue?: boolean; show?: boolean }) => ({
    alignItems: 'center',
    background: th.colors.brand.containerBackground,
    border: hasValue || show ? th.borders.secondary : th.borders.disabled,
    borderRadius: th.borderRadii.input,
    boxShadow: th.shadows.boxLight,
    cursor: 'pointer',
    height: th.heights.input,
    transition: th.transitions.default,
    width: th.widths.input,
    ':hover': {
      border: th.borders.secondary,
      '> p': {
        opacity: hasValue ? 1 : th.opacities.secondary,
      },
    },
  }),
  ...divPropsSet,
);

const IconWrapper = styled(l.Flex)({
  alignItems: 'center',
  height: th.sizes.fill,
  justifyContent: 'center',
  width: 48,
});

const DateText = styled(ty.BodyText)(
  ({ hasValue, show }: { hasValue?: boolean; show?: boolean }) => ({
    flex: 1,
    opacity: hasValue
      ? 1
      : show
      ? th.opacities.secondary
      : th.opacities.disabled,
    transition: th.transitions.default,
  }),
);

const ClearWrapper = styled(IconWrapper)({
  cursor: 'pointer',
  opacity: 0.8,
  transition: th.transitions.default,
  width: 40,
  ':hover': {
    opacity: 1,
  },
});

const PickerWrapper = styled(l.Div)({
  left: 0,
  paddingTop: th.spacing.sm,
  position: 'absolute',
  top: th.heights.input + 2,
});

export const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

export const getFormattedDateRange = (
  startDate: Date,
  endDate: Date,
  showAsWeekNumber?: boolean,
  showLongDate?: boolean,
) => {
  if (showLongDate) {
    return format(startDate, 'EEE, MMM d, yyyy');
  } else if (showAsWeekNumber) {
    return `Week ${getISOWeek(startDate)}`;
  }
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const isSameDate = formattedStartDate === formattedEndDate;
  return `${formattedStartDate}${isSameDate ? '' : ' : ' + formattedEndDate}`;
};

const defaultRange = [
  {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  },
];

export interface DateRangeProps extends DateRangePickerProps {
  allowEmpty?: boolean;
  hideDefinedRanges?: boolean;
  onClear: () => void;
  placeholder?: string;
  showAsWeekNumber?: boolean;
  showLongDate?: boolean;
  singleSelection?: boolean;
  weekChangeType?: 'agenda' | 'default';
}

const DateRangePicker = ({
  hideDefinedRanges,
  onChange,
  onClear,
  placeholder = 'All dates',
  ranges,
  showAsWeekNumber,
  showLongDate,
  singleSelection,
  ...rest
}: DateRangeProps) => {
  const [show, setShow] = useState(false);
  const ref = useOutsideClickRef(() => {
    setShow(false);
  });
  const selectedDates = ranges && ranges[0];
  const hasValue = !!(selectedDates && selectedDates.endDate);
  const formattedDateRange =
    hasValue && selectedDates
      ? getFormattedDateRange(
          selectedDates.startDate as Date,
          selectedDates.endDate as Date,
          showAsWeekNumber,
          showLongDate,
        )
      : placeholder;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
    setShow(false);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const width =
    singleSelection && !showLongDate && !showAsWeekNumber ? 200 : undefined;

  return (
    <Wrapper ref={ref}>
      <Control
        hasValue={hasValue}
        onClick={toggleShow}
        show={show}
        width={width}
      >
        <IconWrapper>
          <CalendarImg height={18} />
        </IconWrapper>
        <DateText hasValue={hasValue} show={show}>
          {formattedDateRange}
        </DateText>
        {hasValue ? (
          <ClearWrapper onClick={handleClear}>
            <CloseImg height={12} />
          </ClearWrapper>
        ) : (
          <div />
        )}
      </Control>
      {show && (
        <PickerWrapper>
          <DateRange
            className={hideDefinedRanges ? 'hideDefinedRanges' : undefined}
            direction="horizontal"
            moveRangeOnFirstSelection={false}
            onChange={onChange}
            ranges={ranges || defaultRange}
            rangeColors={[th.colors.brand.primaryAccent]}
            showSelectionPreview={true}
            {...(singleSelection
              ? {
                  focusedRange: [0, 0],
                  inputRanges: [],
                  staticRanges: [],
                }
              : undefined)}
            {...rest}
          />
        </PickerWrapper>
      )}
    </Wrapper>
  );
};

export default DateRangePicker;
