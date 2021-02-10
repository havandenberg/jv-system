import React, { useState } from 'react';
import { OnChangeProps, Range } from 'react-date-range';

import DateRangePicker, { formatDate } from 'components/date-range-picker';
import { useDateRangeQueryParams } from 'hooks/use-query-params';

const useDateRange = () => {
  const [
    { startDate, endDate },
    setDateRangeParams,
  ] = useDateRangeQueryParams();
  const [selectedDates, setSelectedDates] = useState<
    OnChangeProps[] | undefined
  >(
    startDate && endDate
      ? [
          {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            key: 'selection',
          },
        ]
      : undefined,
  );

  const handleChange = (changeProps: OnChangeProps) => {
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
    selectedDates,
    DateRangePicker: (
      <DateRangePicker
        onChange={handleChange}
        onClear={handleClear}
        ranges={selectedDates as Range[]}
      />
    ),
  };
};

export default useDateRange;
