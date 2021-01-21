import React, { useState } from 'react';
import DateRangePicker from 'components/date-range-picker';
import { OnChangeProps, Range } from 'react-date-range';

const useDateRange = () => {
  const [selectedDates, setSelectedDates] = useState<
    OnChangeProps[] | undefined
  >();

  return {
    selectedDates,
    DateRangePicker: (
      <DateRangePicker
        onChange={(item: any) => setSelectedDates([item.selection])}
        onClear={() => {
          setSelectedDates(undefined);
        }}
        ranges={selectedDates as Range[]}
      />
    ),
  };
};

export default useDateRange;
