import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

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
import PsaArrivalPalletDetails from './psa-arrival/pallets/details';

export const breadcrumbs = (type: string, search: string) => [
  { text: 'All Inspections', to: `/reports/inspections/${type}${search}` },
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
    text: 'PSA',
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}${queryParams}`,
  },
  {
    id: InspectionTypes.CHILE_DEPARTURE,
    text: 'QIMA',
    to: `/reports/inspections/${InspectionTypes.CHILE_DEPARTURE}${queryParams}`,
  },
  {
    id: InspectionTypes.PERU_DEPARTURE,
    text: 'Peru',
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
  const { search } = useLocation();
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
            breadcrumbs={breadcrumbs(InspectionTypes.PERU_DEPARTURE, search)}
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
            breadcrumbs={breadcrumbs(InspectionTypes.CHILE_DEPARTURE, search)}
            {...components}
          />
        )}
      />
      <Route
        path={`/reports/inspections/${InspectionTypes.ARRIVAL}/:reportId/pallets/:id`}
        component={PsaArrivalPalletDetails}
      />
      <Route
        path={`/reports/inspections/${InspectionTypes.ARRIVAL}/:id/:routeTabId?`}
        component={PsaInspectionDetails}
      />
      <Route
        path={`/reports/inspections/${InspectionTypes.ARRIVAL}`}
        render={() => (
          <PsaArrivalInspections
            breadcrumbs={breadcrumbs(InspectionTypes.ARRIVAL, search)}
            {...components}
          />
        )}
      />
      <Redirect
        to={`/reports/inspections/${InspectionTypes.ARRIVAL}${search}`}
      />
    </Switch>
  );
};

export default Inspections;
