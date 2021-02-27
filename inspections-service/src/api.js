const { GraphQLClient, gql } = require('graphql-request');

const gqlClient = new GraphQLClient(process.env.DATABASE_API_URL);

const DISTINCT_VALUES = gql`
  query DISTINCT_VALUES($columnName: String, $tableName: String) {
    distinctValues(columnName: $columnName, tableName: $tableName) {
      nodes
    }
  }
`;

module.exports = {
  gql,
  gqlClient,
  DISTINCT_VALUES,
};
