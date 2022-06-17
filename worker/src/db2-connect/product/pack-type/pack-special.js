const { gql } = require('../../../api');

const PACK_SPECIAL_LIST = gql`
  query PACK_SPECIAL_LIST {
    packSpecials {
      nodes {
        id
        shipperId
        customerCode
        customerId
        customerName
      }
    }
  }
`;

const BULK_UPSERT_PACK_SPECIAL = gql`
  mutation BULK_UPSERT_PACK_SPECIAL($input: BulkUpsertPackSpecialInput!) {
    bulkUpsertPackSpecial(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackSpecial = (packSpecial, db2PackSpecial, id) => ({
  ...packSpecial,
  id,
  shipperId: db2PackSpecial['SHPR#O'],
  customerCode: db2PackSpecial['CCODEO'],
  customerId: db2PackSpecial['CUST#O'],
  customerName: db2PackSpecial['CNAMEO'],
});

const getPackSpecialId = (db2PackSpecial, packSpecials) => {
  const packSpecial = Object.values(packSpecials).find(
    (pa) =>
      pa.shipperId === db2PackSpecial['SHPR#O'].trimEnd() &&
      pa.customerCode === db2PackSpecial['CCODEO'].trimEnd(),
  );

  return (
    packSpecial?.id || `${db2PackSpecial['SHPR#O']}-${db2PackSpecial['CCODEO']}`
  );
};

const packSpecialOptions = {
  db2Query: 'select * from JVFIL.INVP514O;',
  listQuery: PACK_SPECIAL_LIST,
  upsertQuery: BULK_UPSERT_PACK_SPECIAL,
  itemName: 'pack special',
  itemPluralName: 'pack specials',
  itemQueryName: 'packSpecials',
  upsertQueryName: 'packSpecials',
  getUpdatedItem: getUpdatedPackSpecial,
  getId: getPackSpecialId,
};

module.exports = packSpecialOptions;
