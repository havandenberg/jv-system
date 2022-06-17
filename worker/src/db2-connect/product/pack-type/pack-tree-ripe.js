const { gql } = require('../../../api');

const PACK_TREE_RIPE_LIST = gql`
  query PACK_TREE_RIPE_LIST {
    packTreeRipes {
      nodes {
        id
        shipperId
        treeRipe
        treeRipeDescription
      }
    }
  }
`;

const BULK_UPSERT_PACK_TREE_RIPE = gql`
  mutation BULK_UPSERT_PACK_TREE_RIPE($input: BulkUpsertPackTreeRipeInput!) {
    bulkUpsertPackTreeRipe(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackTreeRipe = (packTreeRipe, db2PackTreeRipe, id) => ({
  ...packTreeRipe,
  id,
  shipperId: db2PackTreeRipe['SHPR#U'],
  treeRipe: db2PackTreeRipe['TREEU'],
  treeRipeDescription: db2PackTreeRipe['DESCTU'],
});

const getPackTreeRipeId = (db2PackTreeRipe, packTreeRipes) => {
  const packTreeRipe = Object.values(packTreeRipes).find(
    (pa) =>
      pa.shipperId === db2PackTreeRipe['SHPR#U'].trimEnd() &&
      pa.treeRipe === db2PackTreeRipe['TREEU'].trimEnd(),
  );

  return (
    packTreeRipe?.id ||
    `${db2PackTreeRipe['SHPR#U']}-${db2PackTreeRipe['TREEU']}`
  );
};

const packTreeRipeOptions = {
  db2Query: 'select * from JVFIL.INVP520U;',
  listQuery: PACK_TREE_RIPE_LIST,
  upsertQuery: BULK_UPSERT_PACK_TREE_RIPE,
  itemName: 'pack treeRipe',
  itemPluralName: 'pack treeRipes',
  itemQueryName: 'packTreeRipes',
  upsertQueryName: 'packTreeRipes',
  getUpdatedItem: getUpdatedPackTreeRipe,
  getId: getPackTreeRipeId,
};

module.exports = packTreeRipeOptions;
