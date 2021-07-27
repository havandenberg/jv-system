import { isAfter } from 'date-fns';

import { LabelInfo } from 'components/column-label';
import { CalendarEvent } from 'types';

export type CalendarEventLabelInfo = LabelInfo<CalendarEvent>;

export const baseLabels: CalendarEventLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'startDate',
    label: 'Start Date',
  },
  {
    key: 'endDate',
    label: 'End Date',
    validate: ({ endDate, startDate }) => isAfter(endDate, startDate),
  },
  {
    key: 'title',
    label: 'Title',
    validate: ({ title }) => title.length > 0,
  },
  {
    key: 'id',
    label: 'ID',
  },
];
