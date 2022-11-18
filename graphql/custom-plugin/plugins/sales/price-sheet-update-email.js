const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const { onError, sendEmail } = require('../../utils');

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
        await sendEmail({
          toRecipients:
            process.env.REACT_APP_IS_PRODUCTION === 'true'
              ? [
                  'akorthaus@jacvandenberg.com',
                  'bschiro@jacvandenberg.com',
                  'fvandenberg@jacvandenberg.com',
                  'gvandenberg@jacvandenberg.com',
                  'hvandenberg@jacvandenberg.com',
                  'mfarris@jacvandenberg.com',
                  'npaap@jacvandenberg.com',
                  'sstedman@jacvandenberg.com',
                  'jstair@jacvandenberg.com',
                ]
              : ['hvandenberg@jacvandenberg.com'],
          body: `The price sheet has been updated. <a href="${process.env.REACT_APP_CLIENT_URL}/sales/price-sheet">View latest changes here.</a><br /><br />${args.input.message}`,
          subject: 'Price Sheet Updated',
        })
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
