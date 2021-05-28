const EWS = require('node-ews');
const { gql, makeExtendSchemaPlugin } = require('graphile-utils');

const ewsConfig = {
  username: process.env.PDI_USERNAME,
  password: process.env.PDI_PASSWORD,
  host: process.env.PDI_EWS_SERVER,
};

const ews = new EWS(ewsConfig);

const ewsArgs = {
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
      Subject: 'Price Sheet Updated',
      Body: {
        attributes: {
          BodyType: 'HTML',
        },
        $value: `The price sheet has been updated. <a href="${process.env.REACT_APP_CLIENT_URL}/sales/price-sheet">View latest changes here.</a>`,
      },
      ToRecipients: {
        Mailbox: {
          EmailAddress: 'hvandenberg@jacvandenberg.com',
        },
      },
      IsRead: 'false',
    },
  },
};

const onError = (err) => {
  console.log(err.stack);
};

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    extend type Mutation {
      sendPriceSheetUpdateEmail: String!
    }
  `,
  resolvers: {
    Mutation: {
      sendPriceSheetUpdateEmail: async () => {
        let result = '';
        await ews
          .run('CreateItem', ewsArgs)
          .then(() => {
            const successMessage = `Price Sheet Update email sent at ${new Date()}`;
            result = successMessage;
            console.log(successMessage);
          })
          .catch(onError);
        return result;
      },
    },
  },
});

module.exports = extendSchemaPlugin;
