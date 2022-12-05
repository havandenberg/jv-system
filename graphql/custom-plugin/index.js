const {
  AtomicMutationsPlugin,
} = require('postgraphile-plugin-atomic-mutations');
const { makePluginByCombiningPlugins } = require('graphile-utils');

const ChileDepartureInspectionPalletPlugin = require('./plugins/inspections/chile-departure-inspection-pallet');
const DB2ConnectPlugin = require('./plugins/db2-connect');
const NotifyUnpaidsPlugin = require('./plugins/accounting/notify-unpaids-email');
const PeruDepartureInspectionPlugin = require('./plugins/inspections/peru-departure-inspection');
const PsaArrivalInspectionPlugin = require('./plugins/inspections/psa-arrival-inspection');
const PriceSheetUpdateEmailPlugin = require('./plugins/sales/price-sheet-update-email');
const PersonContactOrderByPlugin = require('./plugins/directory/person-contact-order-by');
const ProjectionReviewEmailPlugin = require('./plugins/projections/projection-review');

module.exports = makePluginByCombiningPlugins(
  AtomicMutationsPlugin,
  ChileDepartureInspectionPalletPlugin,
  DB2ConnectPlugin,
  NotifyUnpaidsPlugin,
  PeruDepartureInspectionPlugin,
  PsaArrivalInspectionPlugin,
  PriceSheetUpdateEmailPlugin,
  PersonContactOrderByPlugin,
  ProjectionReviewEmailPlugin,
);
