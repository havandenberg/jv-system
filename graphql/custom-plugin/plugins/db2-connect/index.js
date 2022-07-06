const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const { db2Query, onError } = require('../../utils/index');

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    input DB2QueryInput {
      queryString: String!
    }

    extend type Query {
      db2Query(input: DB2QueryInput): String!
    }
  `,
  resolvers: {
    Query: {
      db2Query: async (_query, args) => {
        const { queryString } = args.input;
        const result = await db2Query({ queryString }).catch(onError);
        return JSON.stringify(result);
      },
    },
  },
});

module.exports = extendSchemaPlugin;
