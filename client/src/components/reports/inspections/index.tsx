import React from 'react';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useParams,
} from 'react-router-dom';

import { BreadcrumbProps } from 'components/nav/breadcrumbs';

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

export interface SubInspectionsProps {
  breadcrumbs: BreadcrumbProps[];
}

const Inspections = () => {
  const { search } = useLocation();
  const { routeTabId } = useParams<{ routeTabId: string }>();
  const isArrival = routeTabId === InspectionTypes.ARRIVAL;
  const isChileDeparture = routeTabId === InspectionTypes.CHILE_DEPARTURE;
  const isPeruDeparture = routeTabId === InspectionTypes.PERU_DEPARTURE;

  const listComponent = () =>
    isArrival ? (
      <PsaArrivalInspections
        breadcrumbs={breadcrumbs(InspectionTypes.ARRIVAL, search)}
      />
    ) : isChileDeparture ? (
      <ChileDepartureInspections
        breadcrumbs={breadcrumbs(InspectionTypes.CHILE_DEPARTURE, search)}
      />
    ) : isPeruDeparture ? (
      <PeruDepartureInspections
        breadcrumbs={breadcrumbs(InspectionTypes.PERU_DEPARTURE, search)}
      />
    ) : null;

  const detailsComponent = () =>
    isArrival ? (
      <PsaInspectionDetails />
    ) : isChileDeparture ? (
      <ChileInspectionDetails />
    ) : isPeruDeparture ? (
      <PeruInspectionDetails />
    ) : null;

  const palletDetailsComponent = () =>
    isArrival ? <PsaArrivalPalletDetails /> : null;

  return (
    <Switch>
      <Route
        path={`/reports/inspections/:routeTabId/:reportId/pallets/:id`}
        render={palletDetailsComponent}
      />
      <Route
        path={`/reports/inspections/:routeTabId/:id`}
        render={detailsComponent}
      />
      <Route path={`/reports/inspections/:routeTabId`} render={listComponent} />
      <Redirect to={`/reports/inspections/arrival${search}`} />
    </Switch>
  );
};

export default Inspections;
