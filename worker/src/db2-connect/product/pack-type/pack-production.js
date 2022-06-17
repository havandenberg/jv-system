const { gql } = require('../../../api');

const PACK_PRODUCTION_LIST = gql`
  query PACK_PRODUCTION_LIST {
    packProductions {
      nodes {
        id
        shipperId
        productionCode
        productionDescription
        combineWith
      }
    }
  }
`;

const BULK_UPSERT_PACK_PRODUCTION = gql`
  mutation BULK_UPSERT_PACK_PRODUCTION($input: BulkUpsertPackProductionInput!) {
    bulkUpsertPackProduction(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackProduction = (packProduction, db2PackProduction, id) => ({
  ...packProduction,
  id,
  shipperId: db2PackProduction['SHPR#T'],
  productionCode: db2PackProduction['PCODET'],
  productionDescription: db2PackProduction['DESCTT'],
  combineWith: db2PackProduction['CMBT'],
});

const getPackProductionId = (db2PackProduction, packProductions) => {
  const packProduction = Object.values(packProductions).find(
    (pa) =>
      pa.shipperId === db2PackProduction['SHPR#T'].trimEnd() &&
      pa.productionCode === db2PackProduction['PCODET'].trimEnd(),
  );

  return (
    packProduction?.id ||
    `${db2PackProduction['SHPR#T']}-${db2PackProduction['PCODET']}`
  );
};

const packProductionOptions = {
  db2Query: 'select * from JVFIL.INVP519T;',
  listQuery: PACK_PRODUCTION_LIST,
  upsertQuery: BULK_UPSERT_PACK_PRODUCTION,
  itemName: 'pack production',
  itemPluralName: 'pack productions',
  itemQueryName: 'packProductions',
  upsertQueryName: 'packProductions',
  getUpdatedItem: getUpdatedPackProduction,
  getId: getPackProductionId,
};

module.exports = packProductionOptions;
