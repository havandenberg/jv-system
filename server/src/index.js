require('dotenv').config();
const cors = require('cors');
const express = require('express');

const inspectionsController = require('./controllers/inspections');

const server = express();
const port = 3001;

server.use(cors());
server.listen(port, () => console.log('JV server live on ' + port));

server.get('/reports/inspections', inspectionsController);
server.get('/reports/inspections/:id', inspectionsController);
const inspectionsDataRoot = process.env.INSPECTIONS_DIRECTORY;
server.use(express.static(inspectionsDataRoot));
