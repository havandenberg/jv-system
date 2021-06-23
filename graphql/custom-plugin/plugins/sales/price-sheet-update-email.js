const EWS = require('node-ews');
const { gql, makeExtendSchemaPlugin } = require('graphile-utils');

const ewsConfig = {
  username: process.env.PDI_USERNAME,
  password: process.env.PDI_PASSWORD,
  host: process.env.PDI_EWS_SERVER,
};

const ews = new EWS(ewsConfig);

const ewsArgs = (message) => ({
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
        $value: `The price sheet has been updated. <a href="${process.env.REACT_APP_CLIENT_URL}/sales/price-sheet">View latest changes here.</a>\n\n${message}`,
      },
      ToRecipients: {
        Mailbox: [
          // { EmailAddress: 'akorthaus@jacvandenberg.com' },
          // { EmailAddress: 'bschiro@jacvandenberg.com' },
          // { EmailAddress: 'cpadover@jacvandenberg.com' },
          // { EmailAddress: 'fvandenberg@jacvandenberg.com' },
          // { EmailAddress: 'gvandenberg@jacvandenberg.com' },
          { EmailAddress: 'hvandenberg@jacvandenberg.com' },
          // { EmailAddress: 'mfarris@jacvandenberg.com' },
          // { EmailAddress: 'npaap@jacvandenberg.com' },
          // { EmailAddress: 'sstedman@jacvandenberg.com' },
        ],
      },
      IsRead: 'false',
    },
  },
});

const onError = (err) => {
  console.log(err.stack);
};

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    input PriceSheetUpdateInput {
      message: String!
    }
    extend type Mutation {
      sendPriceSheetUpdateEmail(input: PriceSheetUpdateInput): String!
    }
  `,
  resolvers: {
    Mutation: {
      sendPriceSheetUpdateEmail: async (_query, args) => {
        let result = '';
        await ews
          .run('CreateItem', ewsArgs(args.input.message))
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
