const { makePluginByCombiningPlugins } = require('graphile-utils');

const ChileDepartureInspectionPalletPlugin = require('./plugins/chile-departure-inspection-pallet');
const PeruDepartureInspectionPlugin = require('./plugins/peru-departure-inspection');

module.exports = makePluginByCombiningPlugins(
  ChileDepartureInspectionPalletPlugin,
  PeruDepartureInspectionPlugin,
);
