const cron = require('node-cron');

const { fetchChileDepartureInspections } = require('./chile-departure');
const { fetchPeruDepartureInspections } = require('./peru-departure');
const { fetchPsaArrivalInspections } = require('./psa-arrival/reports');
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
} = require('./psa-arrival/pallets');

cron.schedule('40 23 * * *', fetchChileDepartureInspections);
// cron.schedule('0 4 * * *', fetchPeruDepartureInspections);
cron.schedule('20 23 * * *', fetchPsaArrivalInspections);

cron.schedule('0 0 * * *', fetchPsaGrapePallets);
cron.schedule('5 0 * * *', fetchPsaCitrusPallets);
cron.schedule('10 0 * * *', fetchPsaStoneFruitPallets);
cron.schedule('15 0 * * *', fetchPsaPomegranatePallets);
cron.schedule('20 0 * * *', fetchPsaPersimmonPallets);
cron.schedule('25 0 * * *', fetchPsaPearPallets);
cron.schedule('30 0 * * *', fetchPsaLemonPallets);
cron.schedule('35 0 * * *', fetchPsaCherryPallets);
cron.schedule('40 0 * * *', fetchPsaApplePallets);
