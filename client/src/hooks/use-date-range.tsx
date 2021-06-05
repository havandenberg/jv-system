import React, { useState } from 'react';
import { OnChangeProps, Range } from 'react-date-range';

import DateRangePicker, {
  DateRangeProps,
  formatDate,
} from 'components/date-range-picker';
import { useDateRangeQueryParams } from 'hooks/use-query-params';

const useDateRange = (props?: Omit<DateRangeProps, 'onClear'>) => {
  const [{ startDate, endDate }, setDateRangeParams] =
    useDateRangeQueryParams();
  const [selectedDates, setSelectedDates] = useState<
    OnChangeProps[] | undefined
  >(
    startDate && endDate
      ? [
          {
            startDate: new Date(startDate.replace(/-/g, '/')),
            endDate: new Date(endDate.replace(/-/g, '/')),
            key: 'selection',
          },
        ]
      : undefined,
  );

  const handleDateChange = (changeProps: OnChangeProps) => {
    const range = (changeProps as { selection: Range }).selection;
    const dateRangeParams = {
      startDate: range.startDate ? formatDate(range.startDate) : undefined,
      endDate: range.endDate ? formatDate(range.endDate) : undefined,
    };
    setDateRangeParams(dateRangeParams);
    setSelectedDates([(changeProps as { selection: Range }).selection]);
  };

  const handleClear = () => {
    setDateRangeParams({ startDate: undefined, endDate: undefined });
    setSelectedDates(undefined);
  };

  return {
    handleDateChange,
    selectedDates,
    DateRangePicker: (
      <DateRangePicker
        onChange={handleDateChange}
        onClear={handleClear}
        ranges={selectedDates as Range[]}
        {...props}
      />
    ),
  };
};

export default useDateRange;
