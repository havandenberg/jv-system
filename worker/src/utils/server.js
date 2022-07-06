require('dotenv').config();
const cors = require('cors');
const express = require('express');
const ibmdb = require('ibm_db');
const EWS = require('node-ews');
const { onError } = require('.');
const { ewsArgs } = require('./ews');

const server = express();
const db2Conn = ibmdb.openSync(process.env.DB2_CONNECT_STRING);

server.use(cors());
server.use(express.json());

const ewsConfig = {
  username: process.env.PDI_USERNAME,
  password: process.env.PDI_PASSWORD,
  host: process.env.PDI_EWS_SERVER,
};

const ews = new EWS(ewsConfig);

server.post('/send-email', async (req, res) => {
  const response = await ews
    .run('CreateItem', ewsArgs(req.body))
    .catch(onError);
  return res.status(200).send({ ...response, success: true });
});

server.post('/db2-query', async (req, res) => {
  const data = await db2Conn.query(req.body.queryString).catch(onError);
  console.log(data);
  return res.status(200).send(JSON.stringify({ data, success: true }));
});

module.exports = {
  ews,
  ewsArgs,
  server,
};
