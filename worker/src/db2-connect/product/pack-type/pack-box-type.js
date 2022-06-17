const { gql } = require('../../../api');

const PACK_BOX_TYPE_LIST = gql`
  query PACK_BOX_TYPE_LIST {
    packBoxTypes {
      nodes {
        id
        shipperId
        boxType
        boxDescription
      }
    }
  }
`;

const BULK_UPSERT_PACK_BOX_TYPE = gql`
  mutation BULK_UPSERT_PACK_BOX_TYPE($input: BulkUpsertPackBoxTypeInput!) {
    bulkUpsertPackBoxType(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackBoxType = (packBoxType, db2PackBoxType, id) => ({
  ...packBoxType,
  id,
  shipperId: db2PackBoxType['SHPR#P'],
  boxType: db2PackBoxType['BOXP'],
  boxDescription: db2PackBoxType['BXDSCP'],
});

const getPackBoxTypeId = (db2PackBoxType, packBoxTypes) => {
  const packBoxType = Object.values(packBoxTypes).find(
    (pa) =>
      pa.shipperId === db2PackBoxType['SHPR#P'].trimEnd() &&
      pa.boxType === db2PackBoxType['BOXP'].trimEnd(),
  );

  return (
    packBoxType?.id || `${db2PackBoxType['SHPR#P']}-${db2PackBoxType['BOXP']}`
  );
};

const packBoxTypeOptions = {
  db2Query: 'select * from JVFIL.INVP515P;',
  listQuery: PACK_BOX_TYPE_LIST,
  upsertQuery: BULK_UPSERT_PACK_BOX_TYPE,
  itemName: 'pack box type',
  itemPluralName: 'pack box types',
  itemQueryName: 'packBoxTypes',
  upsertQueryName: 'packBoxTypes',
  getUpdatedItem: getUpdatedPackBoxType,
  getId: getPackBoxTypeId,
};

module.exports = packBoxTypeOptions;
