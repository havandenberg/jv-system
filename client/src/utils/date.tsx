import {
  add,
  format,
  getDay,
  getISOWeek,
  isAfter,
  isBefore,
  isEqual,
  isMonday,
  isWednesday,
  startOfISOWeek,
} from 'date-fns';

export const getCurrentWeekNumber = () => getISOWeek(new Date());

export const getWeekNumber = (date: Date) => getISOWeek(date);

export const isCurrentWeek = (weekNumber: number) =>
  weekNumber === getCurrentWeekNumber();

export const getDateOfISOWeek = (
  weekNumber: number,
  formatString?: string,
  year: number = new Date().getFullYear(),
) => {
  const temp = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const dayOfWeek = temp.getDay();
  let startDate = temp;
  if (dayOfWeek <= 4) startDate.setDate(temp.getDate() - temp.getDay() + 1);
  else startDate.setDate(temp.getDate() + 8 - temp.getDay());
  return formatString ? format(startDate, formatString) : startDate;
};

export const getClosestMeetingDay = (date: Date) => {
  if ([1, 2].includes(getDay(date))) {
    return startOfISOWeek(date);
  } else {
    return add(startOfISOWeek(date), {
      days: [1, 2].includes(getDay(date)) ? 0 : 2,
    });
  }
};

export const isMondayOrWednesday = (date: Date) =>
  isMonday(date) || isWednesday(date);

export const isDateGreaterThanOrEqualTo = (date: Date, dateToCompare: Date) =>
  isEqual(date, dateToCompare) || isAfter(date, dateToCompare);

export const isDateLessThanOrEqualTo = (date: Date, dateToCompare: Date) =>
  isEqual(date, dateToCompare) || isBefore(date, dateToCompare);
