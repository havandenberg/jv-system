import { formatDate } from 'components/date-range-picker';
import { add } from 'date-fns';
import { useEffect } from 'react';
import { OnChangeProps } from 'react-date-range';
import { UpdateType, useDateRangeQueryParams } from './use-query-params';

const useKeyboardWeekChange = (
  handleDateChange: (
    changeProps: OnChangeProps,
    updateType?: UpdateType,
  ) => void,
) => {
  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();

  const handleWeekChange = (weeks: number) => {
    const newDate = add(new Date(startDate.replace(/-/g, '/')), {
      weeks,
    });
    handleDateChange({
      selection: {
        startDate: newDate,
        endDate: newDate,
        key: 'selection',
      },
    });
  };

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
};

export default useKeyboardWeekChange;
