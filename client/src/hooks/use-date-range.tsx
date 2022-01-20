import React, { useCallback, useEffect, useState } from 'react';
import { add, isMonday, isWednesday } from 'date-fns';
import { OnChangeProps, Range } from 'react-date-range';

import ArrowInCircle from 'assets/images/arrow-in-circle';
import DateRangePicker, {
  DateRangeProps,
  formatDate,
} from 'components/date-range-picker';
import { useDateRangeQueryParams } from 'hooks/use-query-params';
import l from 'ui/layout';
import th from 'ui/theme';
import {
  getClosestMeetingDay,
  getWeekNumber,
  isMondayOrWednesday,
} from 'utils/date';

const useDateRange = (props?: Omit<DateRangeProps, 'onClear'>) => {
  const { allowEmpty, weekChangeType } = props || {};
  const [
    { startDate: startDateQuery, endDate: endDateQuery },
    setDateRangeParams,
  ] = useDateRangeQueryParams();
  const startDate = startDateQuery
    ? new Date(startDateQuery.replace(/-/g, '/'))
    : new Date();
  const endDate = endDateQuery
    ? new Date(endDateQuery.replace(/-/g, '/'))
    : new Date();

  const [selectedDates, setSelectedDates] = useState<
    OnChangeProps[] | undefined
  >(
    startDate && endDate
      ? [
          {
            startDate,
            endDate,
            key: 'selection',
          },
        ]
      : undefined,
  );

  const handleDateChange = useCallback(
    (changeProps: OnChangeProps) => {
      const range = (changeProps as { selection: Range }).selection;
      const dateRangeParams = {
        startDate: range.startDate ? formatDate(range.startDate) : undefined,
        endDate: range.endDate ? formatDate(range.endDate) : undefined,
      };
      setDateRangeParams(dateRangeParams);
      setSelectedDates([(changeProps as { selection: Range }).selection]);
    },
    [setDateRangeParams],
  );

  const handleClear = () => {
    setDateRangeParams({ startDate: undefined, endDate: undefined });
    setSelectedDates(undefined);
  };

  const selectedWeekNumber = getWeekNumber(startDate);

  const handleWeekChange = (direction: number) => {
    const getNewDate = () => {
      switch (weekChangeType) {
        case 'agenda':
          if (isMonday(startDate)) {
            return add(startDate, {
              days: direction > 0 ? 3 : -4,
            });
          }
          if (isWednesday(startDate)) {
            return add(startDate, {
              days: direction > 0 ? 5 : -2,
            });
          }
          return startDate;
        default:
          return add(startDate, { weeks: direction > 0 ? 1 : -1 });
      }
    };
    let newDate = getNewDate();

    handleDateChange({
      selection: {
        startDate: newDate,
        endDate: newDate,
        key: 'selection',
      },
    });
  };

  useEffect(() => {
    const defaultDate = startDateQuery
      ? new Date(startDateQuery.replace(/-/g, '/'))
      : new Date();
    const isAgenda = weekChangeType === 'agenda';
    const isAgendaDay = isMondayOrWednesday(defaultDate);
    const updatedDate = isAgenda
      ? getClosestMeetingDay(defaultDate)
      : defaultDate;

    if ((!startDateQuery && !allowEmpty) || (isAgenda && !isAgendaDay)) {
      handleDateChange({
        selection: {
          startDate: updatedDate,
          endDate: updatedDate,
          key: 'selection',
        },
      });
    }
  }, [allowEmpty, handleDateChange, startDateQuery, weekChangeType]);

  useEffect(() => {
    if (allowEmpty) {
      handleClear();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBackward = () => handleWeekChange(-1);
  const handleForward = () => handleWeekChange(1);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      if (event.code === 'ArrowRight') handleForward();
      else if (event.code === 'ArrowLeft') handleBackward();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return {
    handleDateChange,
    selectedDates,
    selectedWeekNumber,
    startDate,
    startDateQuery,
    endDate,
    endDateQuery,
    DateRangePicker: (
      <DateRangePicker
        onChange={handleDateChange}
        onClear={handleClear}
        ranges={selectedDates as Range[]}
        {...props}
      />
    ),
    BackwardButton: (
      <l.HoverButton
        borderRadius={th.borderRadii.circle}
        boxShadow={th.shadows.boxLight}
        ml={th.spacing.md}
        onClick={handleBackward}
      >
        <ArrowInCircle
          fill={th.colors.brand.primary}
          height={th.sizes.icon}
          width={th.sizes.icon}
        />
      </l.HoverButton>
    ),
    ForwardButton: (
      <l.HoverButton
        borderRadius={th.borderRadii.circle}
        boxShadow={th.shadows.boxLight}
        ml={th.spacing.md}
        onClick={handleForward}
        transform="scaleX(-1)"
      >
        <ArrowInCircle
          fill={th.colors.brand.primary}
          height={th.sizes.icon}
          width={th.sizes.icon}
        />
      </l.HoverButton>
    ),
  };
};

export default useDateRange;
