const cron = require('node-cron');

const { fetchChileDepartureInspections } = require('./chile-departure');
const { fetchPeruDepartureInspections } = require('./peru-departure');
const { fetchPsaArrivalInspections } = require('./psa-arrival');

cron.schedule('10 0 * * *', fetchChileDepartureInspections);
// cron.schedule('0 4 1 * *', fetchPeruDepartureInspections);
cron.schedule('0 0 * * *', fetchPsaArrivalInspections);
