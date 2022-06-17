const { gql } = require('../../../api');

const PACK_OUT_LIST = gql`
  query PACK_OUT_LIST {
    packOuts(orderBy: SHIPPER_ID_ASC) {
      nodes {
        id
        shipperId
        outCode
        outDescription
        combineWith
      }
    }
  }
`;

const BULK_UPSERT_PACK_OUT = gql`
  mutation BULK_UPSERT_PACK_OUT($input: BulkUpsertPackOutInput!) {
    bulkUpsertPackOut(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackOut = (packOut, db2PackOut, id) => ({
  ...packOut,
  id,
  shipperId: db2PackOut['SHPR#S'],
  outCode: db2PackOut['PACKS'],
  outDescription: db2PackOut['DESCS'],
  combineWith: db2PackOut['CMBS'],
});

const getPackOutId = (db2PackOut, packOuts) => {
  const packOut = Object.values(packOuts).find(
    (pa) =>
      pa.shipperId === db2PackOut['SHPR#S'].trimEnd() &&
      pa.outCode === db2PackOut['PACKS'].trimEnd(),
  );

  return packOut?.id || `${db2PackOut['SHPR#S']}-${db2PackOut['PACKS']}`;
};

const packOutOptions = {
  db2Query: 'select * from JVFIL.INVP518S order by SHPR#S;',
  listQuery: PACK_OUT_LIST,
  upsertQuery: BULK_UPSERT_PACK_OUT,
  itemName: 'pack out',
  itemPluralName: 'pack outs',
  itemQueryName: 'packOuts',
  upsertQueryName: 'packOuts',
  getUpdatedItem: getUpdatedPackOut,
  getId: getPackOutId,
};

module.exports = packOutOptions;
