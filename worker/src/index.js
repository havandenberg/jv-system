const cron = require('node-cron');

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
const sendProjectionReminders = require('./projections/weekly-reminders');

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
