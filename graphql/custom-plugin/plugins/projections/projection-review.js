const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const { ews, getEWSArgs } = require('../../utils/ews');
const { onError } = require('../../utils/index');

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    input ReviewShipperProjectionInput {
      email: String!
      message: String!
      name: String!
      shipperName: String!
      isApproved: Boolean!
    }

    extend type Mutation {
      reviewShipperProjection(input: ReviewShipperProjectionInput): String!
    }
  `,
  resolvers: {
    Mutation: {
      reviewShipperProjection: async (_query, args) => {
        let result = '';
        await ews
          .run(
            'CreateItem',
            getEWSArgs(
              `Jac Vandenberg 4-Week Projection ${
                args.input.isApproved ? 'Approved' : 'Changes Requested'
              }`,
              args.input.message || args.input.isApproved
                ? `Hi ${args.input.name},<br /><br />Your recent projection has been approved. Thank you.<br /><br />Best,<br /><br />- Jac. Vandenberg, Inc`
                : `Hi ${args.input.name},<br /><br />Thank you for your recent projection. We would like to request the following adjustments. Please review and re-submit your projection using the link below.<br /><br /><a href="${process.env.REACT_APP_CLIENT_URL}/sales/price-sheet">View latest changes here.</a><br /><br />Best,<br /><br />- Jac. Vandenberg, Inc`,
              [{ EmailAddress: args.input.email }],
            ),
          )
          .then(() => {
            const successMessage = `\nShipper projection ${
              args.input.isApproved ? 'approved' : 'changes requested'
            } email sent to \"${args.input.shipperName}\" at ${new Date()}\n`;
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
