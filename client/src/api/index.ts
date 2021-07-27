import { setup } from 'axios-cache-adapter';

import * as chileDepartureInspections from 'api/reports/inspections/chile-departure';
import * as peruDepartureInspections from 'api/reports/inspections/peru-departure';
import * as psaArrivalInspections from 'api/reports/inspections/psa-arrival';
import * as groupDirectory from 'api/directory/group';
import * as customerDirectory from 'api/directory/customer';
import * as contactDirectory from 'api/directory/contacts';
import * as shipperDirectory from 'api/directory/shipper';
import * as warehouseDirectory from 'api/directory/warehouse';
import * as priceSheet from 'api/sales/price-sheet';
import * as agenda from 'api/sales/agenda';
import * as calendar from 'api/sales/calendar';
import * as user from 'api/user';

const baseURL = process.env.REACT_APP_SERVER_URL;

const api = setup({
  baseURL,
  cache: {
    maxAge: 15 * 60 * 1000,
  },
});

export default {
  baseURL,
  client: api,
  ...chileDepartureInspections,
  ...peruDepartureInspections,
  ...psaArrivalInspections,
  ...groupDirectory,
  ...customerDirectory,
  ...contactDirectory,
  ...shipperDirectory,
  ...warehouseDirectory,
  ...priceSheet,
  ...agenda,
  ...calendar,
  ...user,
};
