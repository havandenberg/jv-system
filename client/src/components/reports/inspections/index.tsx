import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { BreadcrumbProps } from 'components/nav/breadcrumbs';
import { useTabBar } from 'components/tab-bar';
import useDateRange from 'hooks/use-date-range';
import { useDateRangeQueryParams } from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';

import ChileDepartureInspections from './chile-departure';
import ChileInspectionDetails from './chile-departure/details';
import PeruDepartureInspections from './peru-departure';
import PeruInspectionDetails from './peru-departure/details';
import PsaArrivalInspections from './psa-arrival';
import PsaInspectionDetails from './psa-arrival/details';

export const breadcrumbs = (type: string) => [
  { text: 'All Inspections', to: `/reports/inspections/${type}` },
];
export const gridTemplateColumns = '3.5fr 4fr 4fr 4fr 2fr 2fr 3fr 30px';

export enum InspectionTypes {
  ARRIVAL = 'arrival',
  PERU_DEPARTURE = 'd-peru',
  CHILE_DEPARTURE = 'd-chile',
}

const tabs = (queryParams: string) => [
  {
    id: InspectionTypes.ARRIVAL,
    text: 'Arrival',
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}${queryParams}`,
  },
  {
    id: InspectionTypes.CHILE_DEPARTURE,
    text: 'D - Chile',
    to: `/reports/inspections/${InspectionTypes.CHILE_DEPARTURE}${queryParams}`,
  },
  {
    id: InspectionTypes.PERU_DEPARTURE,
    text: 'D - Peru',
    to: `/reports/inspections/${InspectionTypes.PERU_DEPARTURE}${queryParams}`,
  },
];

export interface SubInspectionsProps {
  breadcrumbs: BreadcrumbProps[];
  DateRangePicker: React.ReactNode;
  Search: React.ReactNode;
  TabBar: React.ReactNode;
}

const Inspections = () => {
  const { Search } = useSearch();
  const [{ startDate: startDateQuery, endDate }] = useDateRangeQueryParams();
  const { TabBar, selectedTabId } = useTabBar(
    tabs(
      startDateQuery && endDate
        ? `?startDate=${startDateQuery}&endDate=${endDate}`
        : '',
    ),
    true,
  );
  const isArrival = InspectionTypes.ARRIVAL === selectedTabId;
  const { DateRangePicker } = useDateRange({
    placeholder: isArrival ? 'Last 30 days' : 'All dates',
  });

  const components = {
    DateRangePicker,
    Search,
    TabBar: <TabBar />,
  };

  return (
    <Switch>
      <Route
        exact
        path={`/reports/inspections/${InspectionTypes.PERU_DEPARTURE}/:id`}
        component={PeruInspectionDetails}
      />
      <Route
        path={`/reports/inspections/${InspectionTypes.PERU_DEPARTURE}`}
        render={() => (
          <PeruDepartureInspections
            breadcrumbs={breadcrumbs(InspectionTypes.PERU_DEPARTURE)}
            {...components}
          />
        )}
      />
      <Route
        exact
        path={`/reports/inspections/${InspectionTypes.CHILE_DEPARTURE}/:id`}
        component={ChileInspectionDetails}
      />
      <Route
        path={`/reports/inspections/${InspectionTypes.CHILE_DEPARTURE}`}
        render={() => (
          <ChileDepartureInspections
            breadcrumbs={breadcrumbs(InspectionTypes.CHILE_DEPARTURE)}
            {...components}
          />
        )}
      />
      <Route
        exact
        path={`/reports/inspections/${InspectionTypes.ARRIVAL}/:id`}
        component={PsaInspectionDetails}
      />
      <Route
        path={`/reports/inspections/${InspectionTypes.ARRIVAL}`}
        render={() => (
          <PsaArrivalInspections
            breadcrumbs={breadcrumbs(InspectionTypes.ARRIVAL)}
            {...components}
          />
        )}
      />
      <Redirect to={`/reports/inspections/${InspectionTypes.ARRIVAL}`} />
    </Switch>
  );
};

export default Inspections;
