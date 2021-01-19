import { setup } from 'axios-cache-adapter';

export const API_BASE = process.env.REACT_APP_API_BASE_URL;

const api = setup({
  baseURL: API_BASE,
  cache: {
    maxAge: 15 * 60 * 1000,
  },
});

export default api;
