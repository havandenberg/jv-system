import React, { useState } from 'react';
import { add, format, getDay, parse, startOfWeek } from 'date-fns';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import RRule, { rrulestr } from 'rrule';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { CalendarEvent } from 'types';
import b from 'ui/button';
import l from 'ui/layout';

import CalendarEventDetails from './details';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type EventType = Omit<CalendarEvent, 'startDate' | 'endDate' | 'nodeId'> & {
  start: Date;
  end: Date;
};

const Calendar = () => {
  const { data, loading, error } = api.useCalendarEvents();
  const items = data
    ? (data.nodes as CalendarEvent[])
        .map(({ startDate, endDate, nodeId, ...rest }) => {
          const recurrence =
            rest.rrule && rrulestr(rest.rrule.replace('\\n', '\n'));
          const startOccurrances = recurrence ? recurrence.all() : [startDate];
          const endOccurrances = recurrence
            ? new RRule({
                freq: recurrence.options.freq,
                interval: recurrence.options.interval,
                until: recurrence.options.until,
                count: recurrence.options.count,
                dtstart: new Date(endDate),
              }).all()
            : [endDate];
          return startOccurrances.map((occ, idx) => ({
            start: new Date(occ),
            end: new Date(endOccurrances[idx]),
            ...rest,
          }));
        })
        .flat()
    : [];

  const [selectedEvent, setSelectedEvent] = useState<
    CalendarEvent | undefined
  >();

  return (
    <Page
      actions={[
        <b.Primary
          key={0}
          onClick={() => {
            setSelectedEvent({
              startDate: new Date(),
              endDate: add(new Date(), { hours: 1 }),
              title: 'New Event',
              id: -1,
            } as CalendarEvent);
          }}
        >
          Create Event
        </b.Primary>,
      ]}
      title="Calendar"
    >
      {data ? (
        <>
          <l.Flex>
            <BigCalendar
              localizer={localizer}
              events={items as EventType[]}
              selectable
              max={new Date(2013, 1, 1, 21)}
              min={new Date(2013, 1, 1, 6)}
              step={30}
              defaultView={Views.WEEK}
              style={{ height: 800, flex: 1 }}
              popup
              onSelectEvent={({ start, end, ...rest }) => {
                setSelectedEvent({
                  startDate: start,
                  endDate: end,
                  ...rest,
                } as CalendarEvent);
              }}
              onSelectSlot={({ start, end }) => {
                setSelectedEvent({
                  startDate: start,
                  endDate: end,
                  title: 'New Event',
                  id: -1,
                } as CalendarEvent);
              }}
              titleAccessor={({ title, eventDescription }) =>
                `${title}\n${eventDescription || ''}`
              }
            />
            <l.Div width="20%" />
          </l.Flex>
          {selectedEvent && (
            <CalendarEventDetails
              event={selectedEvent}
              handleCancel={() => {
                setSelectedEvent(undefined);
              }}
            />
          )}
        </>
      ) : (
        <DataMessage data={items} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Calendar;
