import { setup } from 'axios-cache-adapter';

import * as chileDepartureInspections from 'api/reports/inspections/chile-departure';
import * as peruDepartureInspections from 'api/reports/inspections/peru-departure';
import * as internalDirectory from 'api/directory/internal';
import * as companyDirectory from 'api/directory/company';
import * as officeDirectory from 'api/directory/office';

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
  ...internalDirectory,
  ...companyDirectory,
  ...officeDirectory,
};
