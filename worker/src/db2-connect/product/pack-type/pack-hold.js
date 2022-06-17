const { gql } = require('../../../api');

const PACK_HOLD_LIST = gql`
  query PACK_HOLD_LIST {
    packHolds {
      nodes {
        id
        shipperId
        holdCode
        holdDescription
      }
    }
  }
`;

const BULK_UPSERT_PACK_HOLD = gql`
  mutation BULK_UPSERT_PACK_HOLD($input: BulkUpsertPackHoldInput!) {
    bulkUpsertPackHold(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackHold = (packHold, db2PackHold, id) => ({
  ...packHold,
  id,
  shipperId: db2PackHold['SHPR#A'],
  holdCode: db2PackHold['HOLDA'],
  holdDescription: db2PackHold['DESCTA'],
});

const getPackHoldId = (db2PackHold, packHolds) => {
  const packHold = Object.values(packHolds).find(
    (pa) =>
      pa.shipperId === db2PackHold['SHPR#A'].trimEnd() &&
      pa.holdCode === db2PackHold['HOLDA'].trimEnd(),
  );

  return packHold?.id || `${db2PackHold['SHPR#A']}-${db2PackHold['HOLDA']}`;
};

const packHoldOptions = {
  db2Query: 'select * from JVFIL.INVP526A;',
  listQuery: PACK_HOLD_LIST,
  upsertQuery: BULK_UPSERT_PACK_HOLD,
  itemName: 'pack hold',
  itemPluralName: 'pack holds',
  itemQueryName: 'packHolds',
  upsertQueryName: 'packHolds',
  getUpdatedItem: getUpdatedPackHold,
  getId: getPackHoldId,
};

module.exports = packHoldOptions;
