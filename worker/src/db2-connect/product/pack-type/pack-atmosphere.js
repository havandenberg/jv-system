const { gql } = require('../../../api');

const PACK_ATMOSPHERE_LIST = gql`
  query PACK_ATMOSPHERE_LIST {
    packAtmospheres {
      nodes {
        id
        shipperId
        maCode
        maDescription
      }
    }
  }
`;

const BULK_UPSERT_PACK_ATMOSPHERE = gql`
  mutation BULK_UPSERT_PACK_ATMOSPHERE($input: BulkUpsertPackAtmosphereInput!) {
    bulkUpsertPackAtmosphere(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackAtmosphere = (packAtmosphere, db2PackAtmosphere, id) => ({
  ...packAtmosphere,
  id,
  shipperId: db2PackAtmosphere['SHPR#W'],
  maCode: db2PackAtmosphere['MAW'],
  maDescription: db2PackAtmosphere['DESCTW'],
});

const getPackAtmosphereId = (db2PackAtmosphere, packAtmospheres) => {
  const packAtmosphere = Object.values(packAtmospheres).find(
    (pa) =>
      pa.shipperId === db2PackAtmosphere['SHPR#W'].trimEnd() &&
      pa.maCode === db2PackAtmosphere['MAW'].trimEnd(),
  );

  return (
    packAtmosphere?.id ||
    `${db2PackAtmosphere['SHPR#W']}-${db2PackAtmosphere['MAW']}`
  );
};

const packAtmosphereOptions = {
  db2Query: 'select * from JVFIL.INVP522W;',
  listQuery: PACK_ATMOSPHERE_LIST,
  upsertQuery: BULK_UPSERT_PACK_ATMOSPHERE,
  itemName: 'pack atmosphere',
  itemPluralName: 'pack atmospheres',
  itemQueryName: 'packAtmospheres',
  upsertQueryName: 'packAtmospheres',
  getUpdatedItem: getUpdatedPackAtmosphere,
  getId: getPackAtmosphereId,
};

module.exports = packAtmosphereOptions;
