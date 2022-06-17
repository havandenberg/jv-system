const { gql } = require('../../api');

const PRODUCT_MASTER_LIST = gql`
  query PRODUCT_MASTER_LIST {
    productMasters(orderBy: ID_ASC) {
      nodes {
        id
        defaultPalletQuantity
        lotNumber
      }
    }
  }
`;

const BULK_UPSERT_PRODUCT_MASTER = gql`
  mutation BULK_UPSERT_PRODUCT_MASTER($input: BulkUpsertProductMasterInput!) {
    bulkUpsertProductMaster(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedProductMaster = (productMaster, db2ProductMaster) => ({
  ...productMaster,
  id: db2ProductMaster['ITEME'],
  defaultPalletQuantity: `${db2ProductMaster['DFPLQE']}`,
  lotNumber: db2ProductMaster['LOT#E'],
});

const productMasterOptions = {
  db2Query: `select * from JVFIL.INVP200E order by ITEME;`,
  listQuery: PRODUCT_MASTER_LIST,
  upsertQuery: BULK_UPSERT_PRODUCT_MASTER,
  itemName: 'product master',
  itemPluralName: 'product masters',
  itemQueryName: 'productMasters',
  upsertQueryName: 'productMasters',
  getUpdatedItem: getUpdatedProductMaster,
  idKey: 'ITEME',
  chunkSize: 10,
};

module.exports = productMasterOptions;
