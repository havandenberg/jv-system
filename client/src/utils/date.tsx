import { getISOWeek } from 'date-fns';

export const getCurrentWeekNumber = () => getISOWeek(new Date());

export const getWeekNumber = (date: Date) => getISOWeek(date);

export const isCurrentWeek = (weekNumber: number) =>
  weekNumber === getCurrentWeekNumber();

export const getDateOfISOWeek = (
  weekNumber: number,
  year: number = new Date().getFullYear(),
) => {
  const temp = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const dayOfWeek = temp.getDay();
  let startDate = temp;
  if (dayOfWeek <= 4) startDate.setDate(temp.getDate() - temp.getDay() + 1);
  else startDate.setDate(temp.getDate() + 8 - temp.getDay());
  return startDate;
};
