import React, { useState } from 'react';
import 'react-date-range/dist/styles.css';
import './styles.css';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import {
  DateRangePicker as DateRange,
  DateRangePickerProps,
} from 'react-date-range';

import CalendarImg from 'assets/images/calendar';
import CloseImg from 'assets/images/close';
import useOutsideClickRef from 'hooks/use-outside-click-ref';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Div)({ position: 'relative', zIndex: 10 });

const Control = styled(l.Flex)(
  ({ hasValue, show }: { hasValue?: boolean; show?: boolean }) => ({
    alignItems: 'center',
    background: th.colors.brand.containerBackground,
    border: hasValue || show ? th.borders.secondary : th.borders.disabled,
    borderRadius: th.borderRadii.input,
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

export const getFormattedDateRange = (startDate: Date, endDate: Date) => {
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

interface Props extends DateRangePickerProps {
  onClear: () => void;
}

const DateRangePicker = ({ onChange, onClear, ranges, ...rest }: Props) => {
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
        )
      : 'All dates';

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
    setShow(false);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <Wrapper ref={ref}>
      <Control hasValue={hasValue} onClick={toggleShow} show={show}>
        <IconWrapper>
          <CalendarImg />
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
            direction="horizontal"
            moveRangeOnFirstSelection={false}
            onChange={onChange}
            ranges={ranges || defaultRange}
            rangeColors={[th.colors.brand.primaryAccent]}
            showSelectionPreview={true}
            {...rest}
          />
        </PickerWrapper>
      )}
    </Wrapper>
  );
};

export default DateRangePicker;
