const { GraphQLClient, gql } = require('graphql-request');

const gqlClient = new GraphQLClient(process.env.DATABASE_API_URL);

const DISTINCT_VALUES = gql`
  query DISTINCT_VALUES(
    $columnName: String
    $schemaName: String
    $tableName: String
  ) {
    distinctValues(
      columnName: $columnName
      schemaName: $schemaName
      tableName: $tableName
    ) {
      nodes
    }
  }
`;

const PROJECTION_REMINDERS = gql`
  query PROJECTION_REMINDERS {
    shippers {
      nodes {
        id
        sendProjectionRequest
        shipperName
        shipperPersonContacts {
          nodes {
            personContact {
              firstName
              id
              email
              lastName
              isPrimary
            }
          }
        }
      }
    }
  }
`;

module.exports = {
  gql,
  gqlClient,
  DISTINCT_VALUES,
  PROJECTION_REMINDERS,
};
