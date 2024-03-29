const { gql } = require('../../api');

const VARIETY_LIST = gql`
  query VARIETY_LIST {
    productVarieties(orderBy: ID_ASC) {
      nodes {
        id
        varietyDescription
        secondaryDescription
        customerLetterSequence
        summaryCode
        varietyGroup
        combineWith
      }
    }
  }
`;

const BULK_UPSERT_VARIETY = gql`
  mutation BULK_UPSERT_PRODUCT_VARIETY($input: BulkUpsertProductVarietyInput!) {
    bulkUpsertProductVariety(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_VARIETY = gql`
  mutation BULK_DELETE_PRODUCT_VARIETY($input: BulkDeleteProductVarietyInput!) {
    bulkDeleteProductVariety(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedVariety = (variety, db2Variety) => ({
  ...variety,
  id: db2Variety['VARB'],
  varietyDescription: db2Variety['DESCVB'],
  secondaryDescription: db2Variety['DESC2B'],
  customerLetterSequence: `${db2Variety['SQB']}`,
  summaryCode: db2Variety['SUM2B'],
  varietyGroup: db2Variety['GRPB'],
  combineWith: db2Variety['CMBB'],
});

const varietyOptions = {
  db2Query: 'select * from JVFIL.INVP200B;',
  listQuery: VARIETY_LIST,
  deleteQuery: BULK_DELETE_VARIETY,
  upsertQuery: BULK_UPSERT_VARIETY,
  itemName: 'variety',
  itemPluralName: 'varieties',
  itemQueryName: 'productVarieties',
  upsertQueryName: 'varieties',
  getUpdatedItem: getUpdatedVariety,
  idKey: 'VARB',
  iterationLimit: 2000,
};

module.exports = varietyOptions;
