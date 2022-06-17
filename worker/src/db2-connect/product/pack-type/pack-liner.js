const { gql } = require('../../../api');

const PACK_LINER_LIST = gql`
  query PACK_LINER_LIST {
    packLiners {
      nodes {
        id
        shipperId
        linerCode
        linerDescription
      }
    }
  }
`;

const BULK_UPSERT_PACK_LINER = gql`
  mutation BULK_UPSERT_PACK_LINER($input: BulkUpsertPackLinerInput!) {
    bulkUpsertPackLiner(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackLiner = (packLiner, db2PackLiner, id) => ({
  ...packLiner,
  id,
  shipperId: db2PackLiner['SHPR#X'],
  linerCode: db2PackLiner['LINERX'],
  linerDescription: db2PackLiner['DESCTX'],
});

const getPackLinerId = (db2PackLiner, packLiners) => {
  const packLiner = Object.values(packLiners).find(
    (pa) =>
      pa.shipperId === db2PackLiner['SHPR#X'].trimEnd() &&
      pa.linerCode === db2PackLiner['LINERX'].trimEnd(),
  );

  return packLiner?.id || `${db2PackLiner['SHPR#X']}-${db2PackLiner['LINERX']}`;
};

const packLinerOptions = {
  db2Query: 'select * from JVFIL.INVP523X;',
  listQuery: PACK_LINER_LIST,
  upsertQuery: BULK_UPSERT_PACK_LINER,
  itemName: 'pack liner',
  itemPluralName: 'pack liners',
  itemQueryName: 'packLiners',
  upsertQueryName: 'packLiners',
  getUpdatedItem: getUpdatedPackLiner,
  getId: getPackLinerId,
};

module.exports = packLinerOptions;
