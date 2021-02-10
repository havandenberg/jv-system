import { setup } from 'axios-cache-adapter';

import * as peruDepartureInspections from 'api/reports/inspections/peru-departure';

const baseURL = process.env.REACT_APP_SERVER_URL;

const api = setup({
  baseURL,
  cache: {
    maxAge: 15 * 60 * 1000,
  },
});

export default { baseURL, client: api, ...peruDepartureInspections };
