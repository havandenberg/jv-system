require('dotenv').config();
const cors = require('cors');
const express = require('express');
const ibmdb = require('ibm_db');
const EWS = require('node-ews');

const { onError } = require('.');
const {
  ewsCreateAndSendArgs,
  ewsCreateAttachmentArgs,
  ewsCreateArgs,
  ewsSendArgs,
} = require('./ews');

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
  const { attachments = [], ...rest } = req.body || {};
  const createResponse = await ews
    .run('CreateItem', ewsCreateArgs(rest))
    .then((result) => {
      console.log(JSON.stringify(result));
      return result;
    })
    .catch(onError);

  const { Id, ChangeKey } =
    createResponse.ResponseMessages.CreateItemResponseMessage.Items.Message
      .ItemId.attributes || {};

  const attachmentResponses = [];

  for (const attachment of attachments) {
    await ews
      .run(
        'CreateAttachment',
        ewsCreateAttachmentArgs({
          parentItemId: Id,
          parentItemChangeKey: ChangeKey,
          ...attachment,
        }),
      )
      .then((result) => {
        console.log(JSON.stringify(result));
        attachmentResponses.push(result);
        return result;
      })
      .catch(onError);
  }

  const latestItemId =
    attachments.length > 0
      ? attachmentResponses[attachmentResponses.length - 1].ResponseMessages
          .CreateAttachmentResponseMessage.Attachments.FileAttachment
          .AttachmentId.attributes.RootItemId
      : Id;
  const latestItemChangeKey =
    attachments.length > 0
      ? attachmentResponses[attachmentResponses.length - 1].ResponseMessages
          .CreateAttachmentResponseMessage.Attachments.FileAttachment
          .AttachmentId.attributes.RootItemChangeKey
      : ChangeKey;

  const sendResponse = await ews
    .run(
      'SendItem',
      ewsSendArgs({ itemId: latestItemId, changeKey: latestItemChangeKey }),
    )
    .then((result) => {
      console.log(JSON.stringify(result));
      return result;
    });

  return res.status(200).send({ ...sendResponse, success: true });
});

server.post('/db2-query', async (req, res) => {
  const data = await db2Conn.query(req.body.queryString).catch(onError);
  console.log(data);
  return res.status(200).send(JSON.stringify({ data, success: true }));
});

module.exports = {
  ews,
  ewsCreateAndSendArgs,
  ewsCreateArgs,
  ewsSendArgs,
  server,
};
