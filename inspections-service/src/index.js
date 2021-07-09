const cron = require('node-cron');

const { fetchChileDepartureInspections } = require('./chile-departure');
const { fetchPeruDepartureInspections } = require('./peru-departure');
const { fetchPsaArrivalInspections } = require('./psa-arrival/reports');

cron.schedule('10 0 * * *', fetchChileDepartureInspections);
// cron.schedule('0 4 * * *', fetchPeruDepartureInspections);
cron.schedule('20 23 * * *', fetchPsaArrivalInspections);
