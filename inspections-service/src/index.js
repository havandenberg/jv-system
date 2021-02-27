const cron = require('node-cron');

const { fetchChileDepartureInspections } = require('./chile-departure');
const { fetchPeruDepartureInspections } = require('./peru-departure');

cron.schedule('0 0 1 * *', fetchChileDepartureInspections);
// cron.schedule('0 4 1 * *', fetchPeruDepartureInspections);
