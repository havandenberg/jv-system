import { setup } from 'axios-cache-adapter';

import * as expenses from 'api/accounting/expenses';
import * as invoices from 'api/accounting/invoices';
import * as groupDirectory from 'api/directory/group';
import * as countryDirectory from 'api/directory/country';
import * as customerDirectory from 'api/directory/customer';
import * as contactDirectory from 'api/directory/contacts';
import * as shipperDirectory from 'api/directory/shipper';
import * as vendorDirectory from 'api/directory/vendor';
import * as warehouseDirectory from 'api/directory/warehouse';
import * as inventory from 'api/inventory/inventory/item';
import * as orders from 'api/inventory/orders';
import * as pallets from 'api/inventory/inventory/pallets';
import * as inventoryProducts from 'api/inventory/inventory/products';
import * as products from 'api/inventory/products';
import * as truckLoads from 'api/inventory/truck-loads';
import * as truckRates from 'api/inventory/truck-loads/rates';
import * as vessels from 'api/inventory/vessel';
import * as chileDepartureInspections from 'api/reports/inspections/chile-departure';
import * as peruDepartureInspections from 'api/reports/inspections/peru-departure';
import * as psaArrivalInspections from 'api/reports/inspections/psa-arrival';
import * as priceSheet from 'api/sales/price-sheet';
import * as programs from 'api/sales/programs';
import * as agenda from 'api/sales/agenda';
import * as calendar from 'api/sales/calendar';
import * as projections from 'api/sales/projections';
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
  ...countryDirectory,
  ...customerDirectory,
  ...expenses,
  ...groupDirectory,
  ...inventory,
  ...inventoryProducts,
  ...invoices,
  ...orders,
  ...pallets,
  ...peruDepartureInspections,
  ...priceSheet,
  ...products,
  ...programs,
  ...projections,
  ...psaArrivalInspections,
  ...shipperDirectory,
  ...truckLoads,
  ...truckRates,
  ...user,
  ...vessels,
  ...vendorDirectory,
  ...warehouseDirectory,
};
