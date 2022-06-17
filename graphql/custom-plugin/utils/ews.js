const EWS = require('node-ews');

const ewsConfig = {
  username: process.env.PDI_USERNAME,
  password: process.env.PDI_PASSWORD,
  host: process.env.PDI_EWS_SERVER,
};

const ews = new EWS(ewsConfig);

function getEWSArgs(subject, message, recipients) {
  return {
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
          $value: message,
        },
        ToRecipients: {
          Mailbox: recipients,
        },
        IsRead: 'false',
      },
    },
  };
}

module.exports = {
  ews,
  getEWSArgs,
};
