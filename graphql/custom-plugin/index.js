const {
  AtomicMutationsPlugin,
} = require('postgraphile-plugin-atomic-mutations');
const { makePluginByCombiningPlugins } = require('graphile-utils');

const ChileDepartureInspectionPalletPlugin = require('./plugins/inspections/chile-departure-inspection-pallet');
const PeruDepartureInspectionPlugin = require('./plugins/inspections/peru-departure-inspection');
const PsaArrivalInspectionPlugin = require('./plugins/inspections/psa-arrival-inspection');
const PriceSheetUpdateEmailPlugin = require('./plugins/sales/price-sheet-update-email');
const {
  CustomerPersonContactOrderByPlugin,
  ShipperPersonContactOrderByPlugin,
  WarehousePersonContactOrderByPlugin,
} = require('./plugins/directory/person-contact-order-by');

module.exports = makePluginByCombiningPlugins(
  AtomicMutationsPlugin,
  ChileDepartureInspectionPalletPlugin,
  PeruDepartureInspectionPlugin,
  PsaArrivalInspectionPlugin,
  PriceSheetUpdateEmailPlugin,
  CustomerPersonContactOrderByPlugin,
  ShipperPersonContactOrderByPlugin,
  WarehousePersonContactOrderByPlugin,
);
