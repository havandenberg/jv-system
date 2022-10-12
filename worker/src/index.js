const cron = require('node-cron');

const { db2UpdateTable } = require('./db2-connect');
const {
  fetchChileDepartureInspections,
} = require('./inspections/chile-departure');
const {
  fetchPeruDepartureInspections,
} = require('./inspections/peru-departure');
const {
  fetchPsaArrivalInspections,
} = require('./inspections/psa-arrival/reports');
const {
  fetchPsaGrapePallets,
  fetchPsaCitrusPallets,
  fetchPsaStoneFruitPallets,
  fetchPsaPomegranatePallets,
  fetchPsaPersimmonPallets,
  fetchPsaPearPallets,
  fetchPsaLemonPallets,
  fetchPsaCherryPallets,
  fetchPsaApplePallets,
} = require('./inspections/psa-arrival/pallets');
const sendProjectionReminders = require('./projections/weekly-reminder');
const { server: emailServer } = require('./utils/server');

const port = '3002';
emailServer.listen(port, () => console.log('JV email server live on ' + port));

cron.schedule('0 0 * * *', fetchChileDepartureInspections);
// cron.schedule('0 4 * * *', fetchPeruDepartureInspections);
cron.schedule('55 23 * * *', fetchPsaArrivalInspections);

cron.schedule('10 0 * * *', fetchPsaGrapePallets);
cron.schedule('12 0 * * *', fetchPsaCitrusPallets);
cron.schedule('14 0 * * *', fetchPsaStoneFruitPallets);
cron.schedule('16 0 * * *', fetchPsaPomegranatePallets);
cron.schedule('18 0 * * *', fetchPsaPersimmonPallets);
cron.schedule('20 0 * * *', fetchPsaPearPallets);
cron.schedule('22 0 * * *', fetchPsaLemonPallets);
cron.schedule('24 0 * * *', fetchPsaCherryPallets);
cron.schedule('26 0 * * *', fetchPsaApplePallets);

// cron.schedule('26 0 * * *', sendProjectionReminders);

if (process.env.REACT_APP_IS_PRODUCTION === 'true') {
  cron.schedule('*/5 5-22 * * *', () => db2UpdateTable('directory/country'));
  cron.schedule('*/5 5-22 * * *', () => db2UpdateTable('directory/shipper'));
  cron.schedule('*/5 5-22 * * *', () => db2UpdateTable('directory/customer'));
  cron.schedule('*/5 5-22 * * *', () => db2UpdateTable('directory/warehouse'));
  cron.schedule('*/5 5-22 * * *', () => db2UpdateTable('directory/vendor'));

  cron.schedule('30 */2 5-22 * * *', () => db2UpdateTable('product/vessel'));
  cron.schedule('*/5 5-22 * * *', () =>
    db2UpdateTable('product/inventory-item'),
  );
  cron.schedule('15 */10 5-22 * * *', () => db2UpdateTable('product/pallet'));
  cron.schedule('45 1-59/10 5-22 * * *', () =>
    db2UpdateTable('product/pallet-section'),
  );

  cron.schedule('*/5 5-22 * * *', () =>
    db2UpdateTable('operations/order/master'),
  );
  cron.schedule('*/5 5-22 * * *', () =>
    db2UpdateTable('operations/order/item'),
  );
  cron.schedule('*/5 5-22 * * *', () =>
    db2UpdateTable('operations/truck-load'),
  );

  cron.schedule('0 5 * * *', () => db2UpdateTable('accounting/invoice/header'));
  cron.schedule('0 5 * * *', () => db2UpdateTable('accounting/invoice/item'));

  cron.schedule('*/3 5-22 * * *', () => db2UpdateTable('accounting/expense/header'));
  cron.schedule('*/3 5-22 * * *', () => db2UpdateTable('accounting/expense/item'));

  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/master'));
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/species'));
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/variety'));
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/size'));
  2;
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/pack-master'));
  cron.schedule('*/4 5-22 * * *', () =>
    db2UpdateTable('product/pack-atmosphere'),
  );
  cron.schedule('*/4 5-22 * * *', () =>
    db2UpdateTable('product/pack-box-style'),
  );
  cron.schedule('*/4 5-22 * * *', () =>
    db2UpdateTable('product/pack-box-type'),
  );
  cron.schedule('*/4 5-22 * * *', () =>
    db2UpdateTable('product/pack-destination'),
  );
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/pack-grade'));
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/pack-hold'));
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/pack-label'));
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/pack-liner'));
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/pack-out'));
  cron.schedule('*/4 5-22 * * *', () =>
    db2UpdateTable('product/pack-pallet-type'),
  );
  cron.schedule('*/4 5-22 * * *', () =>
    db2UpdateTable('product/pack-production'),
  );
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/pack-special'));
  cron.schedule('*/4 5-22 * * *', () => db2UpdateTable('product/pack-style'));
  cron.schedule('*/4 5-22 * * *', () =>
    db2UpdateTable('product/pack-tree-ripe'),
  );
}
