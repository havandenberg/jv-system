require('dotenv').config();
const cors = require('cors');
const express = require('express');
const EWS = require('node-ews');

const server = express();

server.use(cors());
server.use(express.json());

const ewsConfig = {
  username: process.env.PDI_USERNAME,
  password: process.env.PDI_PASSWORD,
  host: process.env.PDI_EWS_SERVER,
};

const ews = new EWS(ewsConfig);

const ewsArgs = ({ toRecipients, body, subject }) => ({
  attributes: {
    MessageDisposition: 'SendAndSaveCopy',
  },
  SavedItemFolderId: {
    DistinguishedFolderId: {
      attributes: {
        Id: 'sentitems',
      },
    },
  },
  Items: {
    Message: {
      ItemClass: 'IPM.Note',
      Subject: subject,
      Body: {
        attributes: {
          BodyType: 'HTML',
        },
        $value: body,
      },
      ToRecipients: {
        Mailbox: toRecipients.map((recipient) => ({ EmailAddress: recipient })),
      },
      IsRead: 'false',
    },
  },
});

server.post('/send-email', async (req, res) => {
  const response = await ews.run('CreateItem', ewsArgs(req.body));
  return res.status(200).send({ ...response, success: true });
});

module.exports = {
  ews,
  ewsArgs,
  server,
};
