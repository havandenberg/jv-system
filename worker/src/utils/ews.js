const ewsArgs = ({ ccRecipients = [], toRecipients = [], body, subject }) => ({
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
      CcRecipients: {
        Mailbox: ccRecipients.map((recipient) => ({ EmailAddress: recipient })),
      },
      ToRecipients: {
        Mailbox: toRecipients.map((recipient) => ({ EmailAddress: recipient })),
      },
      IsRead: 'false',
    },
  },
});

module.exports = {
  ewsArgs,
};
