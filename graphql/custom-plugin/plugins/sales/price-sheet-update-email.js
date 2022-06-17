const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const { ews, getEWSArgs } = require('../../utils/ews');
const { onError } = require('../../utils/index');

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
          .run(
            'CreateItem',
            getEWSArgs(
              'Price Sheet Updated',
              `The price sheet has been updated. <a href="${process.env.REACT_APP_CLIENT_URL}/sales/price-sheet">View latest changes here.</a>\n\n${args.input.message}`,
              [
                // { EmailAddress: 'akorthaus@jacvandenberg.com' },
                // { EmailAddress: 'bschiro@jacvandenberg.com' },
                // { EmailAddress: 'fvandenberg@jacvandenberg.com' },
                // { EmailAddress: 'gvandenberg@jacvandenberg.com' },
                { EmailAddress: 'hvandenberg@jacvandenberg.com' },
                // { EmailAddress: 'mfarris@jacvandenberg.com' },
                // { EmailAddress: 'npaap@jacvandenberg.com' },
                // { EmailAddress: 'sstedman@jacvandenberg.com' },
              ],
            ),
          )
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
