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
import * as products from 'api/sales/products';
import * as programs from 'api/sales/programs';
import * as agenda from 'api/sales/agenda';
import * as calendar from 'api/sales/calendar';
import * as projections from 'api/sales/projections';
import * as pallets from 'api/sales/inventory/pallets';
import * as inventory from 'api/sales/inventory/item';
import * as inventoryProducts from 'api/sales/inventory/products';
import * as vessels from 'api/sales/inventory/vessel';
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
  ...agenda,
  ...calendar,
  ...chileDepartureInspections,
  ...contactDirectory,
  ...customerDirectory,
  ...groupDirectory,
  ...inventory,
  ...inventoryProducts,
  ...pallets,
  ...peruDepartureInspections,
  ...priceSheet,
  ...products,
  ...programs,
  ...projections,
  ...psaArrivalInspections,
  ...shipperDirectory,
  ...user,
  ...vessels,
  ...warehouseDirectory,
};
