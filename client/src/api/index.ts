import { setup } from 'axios-cache-adapter';

import useInspections from 'api/inspections';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const api = setup({
  baseURL,
  cache: {
    maxAge: 15 * 60 * 1000,
  },
});

export default { baseURL, client: api, useInspections };
