const ibmdb = require('ibm_db');
const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const { onError } = require('../../utils/index');

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
        let result = '';
        await ibmdb
          .open(process.env.DB2_CONNECT_STRING)
          .then((conn) =>
            conn
              .query(queryString)
              .then((data) => {
                result = data;
                conn.closeSync();
              })
              .catch(onError),
          )
          .catch(onError);
        return JSON.stringify(result);
      },
    },
  },
});

module.exports = extendSchemaPlugin;
