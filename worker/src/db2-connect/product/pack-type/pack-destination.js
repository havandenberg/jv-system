const { gql } = require('../../../api');

const PACK_DESTINATION_LIST = gql`
  query PACK_DESTINATION_LIST {
    packDestinations {
      nodes {
        id
        shipperId
        destinationCode
        destinationDescription
      }
    }
  }
`;

const BULK_UPSERT_PACK_DESTINATION = gql`
  mutation BULK_UPSERT_PACK_DESTINATION(
    $input: BulkUpsertPackDestinationInput!
  ) {
    bulkUpsertPackDestination(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackDestination = (
  packDestination,
  db2PackDestination,
  id,
) => ({
  ...packDestination,
  id,
  shipperId: db2PackDestination['SHPR#Z'],
  destinationCode: db2PackDestination['DESTZ'],
  destinationDescription: db2PackDestination['DESCTZ'],
});

const getPackDestinationId = (db2PackDestination, packDestinations) => {
  const packDestination = Object.values(packDestinations).find(
    (pa) =>
      pa.shipperId === db2PackDestination['SHPR#Z'].trimEnd() &&
      pa.destinationCode === db2PackDestination['DESTZ'].trimEnd(),
  );

  return (
    packDestination?.id ||
    `${db2PackDestination['SHPR#Z']}-${db2PackDestination['DESTZ']}`
  );
};

const packDestinationOptions = {
  db2Query: 'select * from JVFIL.INVP525Z;',
  listQuery: PACK_DESTINATION_LIST,
  upsertQuery: BULK_UPSERT_PACK_DESTINATION,
  itemName: 'pack destination',
  itemPluralName: 'pack destinations',
  itemQueryName: 'packDestinations',
  upsertQueryName: 'packDestinations',
  getUpdatedItem: getUpdatedPackDestination,
  getId: getPackDestinationId,
};

module.exports = packDestinationOptions;
