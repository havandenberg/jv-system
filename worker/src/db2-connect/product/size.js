const { gql } = require('../../api');

const SIZE_LIST = gql`
  query SIZE_LIST {
    productSizes(orderBy: ID_ASC) {
      nodes {
        id
        speciesId
        varietyId
        jvCode
        jvDescription
        shipperCode
        shipperDescription
        combineWith
        combineDescription
        shipperId
      }
    }
  }
`;

const BULK_UPSERT_SIZE = gql`
  mutation BULK_UPSERT_PRODUCT_SIZE($input: BulkUpsertProductSizeInput!) {
    bulkUpsertProductSize(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedSize = (size, db2Size, id) => ({
  ...size,
  id,
  speciesId: db2Size['ITEMC'],
  varietyId: db2Size['VARC'],
  jvCode: db2Size['JVCODC'],
  jvDescription: db2Size['JVDSCC'],
  shipperCode: db2Size['SHPCODC'],
  shipperDescription: db2Size['SHPDSCC'],
  combineWith: db2Size['CMBCODC'],
  combineDescription: db2Size['CMBDSCC'],
  shipperId: db2Size['SHPRC'],
});

const sizeOptions = {
  db2Query: 'select * from JVFIL.INVP205C;',
  listQuery: SIZE_LIST,
  upsertQuery: BULK_UPSERT_SIZE,
  itemName: 'size',
  itemPluralName: 'sizes',
  itemQueryName: 'productSizes',
  upsertQueryName: 'sizes',
  getUpdatedItem: getUpdatedSize,
  useIndexAsId: true,
};

module.exports = sizeOptions;
