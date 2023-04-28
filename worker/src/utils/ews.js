const ewsArgs =
  (messageDisposition) =>
  ({ ccRecipients = [], toRecipients = [], body, subject }) => ({
    attributes: {
      MessageDisposition: messageDisposition,
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
        Subject: subject,
        Body: {
          attributes: {
            BodyType: 'HTML',
          },
          $value: body,
        },
        CcRecipients: {
          Mailbox: ccRecipients.map((recipient) => ({
            EmailAddress: recipient,
          })),
        },
        ToRecipients: {
          Mailbox: toRecipients.map((recipient) => ({
            EmailAddress: recipient,
          })),
        },
        IsRead: 'false',
      },
    },
  });

const ewsCreateAndSendArgs = ewsArgs('SendAndSaveCopy');
const ewsCreateArgs = ewsArgs('SaveOnly');

const ewsCreateAttachmentArgs = ({
  parentItemId,
  parentItemChangeKey,
  name,
  content,
}) => ({
  ParentItemId: {
    attributes: {
      Id: parentItemId,
      ChangeKey: parentItemChangeKey,
    },
  },
  Attachments: {
    FileAttachment: {
      Name: name,
      Content: content,
    },
  },
});

const ewsSendArgs = ({ itemId, changeKey }) => ({
  attributes: {
    SaveItemToFolder: 'true',
  },
  ItemIds: {
    ItemId: {
      attributes: {
        Id: itemId,
        ChangeKey: changeKey,
      },
    },
  },
});

module.exports = {
  ewsCreateAndSendArgs,
  ewsCreateArgs,
  ewsCreateAttachmentArgs,
  ewsSendArgs,
};
