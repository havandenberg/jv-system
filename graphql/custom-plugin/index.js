const {
  AtomicMutationsPlugin,
} = require('postgraphile-plugin-atomic-mutations');
const { makePluginByCombiningPlugins } = require('graphile-utils');

const ChileDepartureInspectionPalletPlugin = require('./plugins/inspections/chile-departure-inspection-pallet');
const PeruDepartureInspectionPlugin = require('./plugins/inspections/peru-departure-inspection');
const PsaArrivalInspectionPlugin = require('./plugins/inspections/psa-arrival-inspection');
const PriceSheetUpdateEmailPlugin = require('./plugins/sales/price-sheet-update-email');
const PersonContactOrderByPlugin = require('./plugins/directory/person-contact-order-by');
const ProjectionReviewEmailPlugin = require('./plugins/projections/projection-review');
const DB2Connect = require('./plugins/db2-connect');

module.exports = makePluginByCombiningPlugins(
  AtomicMutationsPlugin,
  ChileDepartureInspectionPalletPlugin,
  PeruDepartureInspectionPlugin,
  PsaArrivalInspectionPlugin,
  PriceSheetUpdateEmailPlugin,
  PersonContactOrderByPlugin,
  ProjectionReviewEmailPlugin,
  DB2Connect,
);
