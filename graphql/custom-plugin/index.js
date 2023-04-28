const {
  AtomicMutationsPlugin,
} = require('postgraphile-plugin-atomic-mutations');
const { makePluginByCombiningPlugins } = require('graphile-utils');

const NotifyUnpaidsPlugin = require('./plugins/accounting/notify-unpaids-email');
const ContainerScheduleUpdatePlugin = require('./plugins/containers/schedule-update-email');
const DB2ConnectPlugin = require('./plugins/db2-connect');
const PersonContactOrderByPlugin = require('./plugins/directory/person-contact-order-by');
const ChileDepartureInspectionPalletPlugin = require('./plugins/inspections/chile-departure-inspection-pallet');
const PeruDepartureInspectionPlugin = require('./plugins/inspections/peru-departure-inspection');
const PsaArrivalInspectionPlugin = require('./plugins/inspections/psa-arrival-inspection');
const ProjectionReviewEmailPlugin = require('./plugins/projections/projection-review');
const PriceSheetUpdateEmailPlugin = require('./plugins/sales/price-sheet-update-email');

module.exports = makePluginByCombiningPlugins(
  AtomicMutationsPlugin,
  ChileDepartureInspectionPalletPlugin,
  ContainerScheduleUpdatePlugin,
  DB2ConnectPlugin,
  NotifyUnpaidsPlugin,
  PeruDepartureInspectionPlugin,
  PsaArrivalInspectionPlugin,
  PriceSheetUpdateEmailPlugin,
  PersonContactOrderByPlugin,
  ProjectionReviewEmailPlugin,
);
