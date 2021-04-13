import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { BreadcrumbProps } from 'components/nav/breadcrumbs';
import { Tab, useTabBar } from 'components/tab-bar';
import useDateRange from 'hooks/use-date-range';
import useSearch from 'hooks/use-search';

import ChileDepartureInspections from './chile-departure';
import ChileInspectionDetails from './chile-departure/details';
import PeruDepartureInspections from './peru-departure';
import PeruInspectionDetails from './peru-departure/details';

export const breadcrumbs = (type: string) => [
  { text: 'All Inspections', to: `/reports/inspections/${type}` },
];
export const gridTemplateColumns = '3.5fr 4fr 4fr 4fr 2fr 2fr 6fr 30px';

export enum InspectionTypes {
  ARRIVAL = 'arrival',
  PERU_DEPARTURE = 'd-peru',
  CHILE_DEPARTURE = 'd-chile',
}

const tabs: Tab[] = [
  {
    id: InspectionTypes.ARRIVAL,
    text: 'Arrival',
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}`,
    disabled: true,
  },
  {
    id: InspectionTypes.CHILE_DEPARTURE,
    text: 'D - Chile',
    to: `/reports/inspections/${InspectionTypes.CHILE_DEPARTURE}`,
  },
  {
    id: InspectionTypes.PERU_DEPARTURE,
    text: 'D - Peru',
    to: `/reports/inspections/${InspectionTypes.PERU_DEPARTURE}`,
  },
];

export interface SubInspectionsProps {
  breadcrumbs: BreadcrumbProps[];
  DateRangePicker: React.ReactNode;
  Search: React.ReactNode;
  TabBar: React.ReactNode;
}

const Inspections = () => {
  const { DateRangePicker } = useDateRange();
  const { Search } = useSearch();
  const { TabBar } = useTabBar(tabs, true);

  const components = {
    DateRangePicker,
    Search,
    TabBar: <TabBar />,
  };

  return (
    <Switch>
      <Route
        exact
        path="/reports/inspections/d-peru/:id"
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
        path="/reports/inspections/d-chile/:id"
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
      <Redirect to={`/reports/inspections/${InspectionTypes.PERU_DEPARTURE}`} />
    </Switch>
  );
};

export default Inspections;
