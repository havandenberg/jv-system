const { gql } = require('../../../api');
const { getDate } = require('../../utils');

const REPACK_ITEM_LIST = gql`
  query REPACK_ITEM_LIST {
    repackItems {
      nodes {
        id
        repackCode
        runNumber
        palletId
        newPalletId
        boxesIn
        boxesOut
        notes
      }
    }
  }
`;

const BULK_UPSERT_REPACK_ITEM = gql`
  mutation BULK_UPSERT_REPACK_ITEM($input: BulkUpsertRepackItemInput!) {
    bulkUpsertRepackItem(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_REPACK_ITEM = gql`
  mutation BULK_DELETE_REPACK_ITEM($input: BulkDeleteRepackItemInput!) {
    bulkDeleteRepackItem(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedRepackItem = (repackItem, db2RepackItem, id) => ({
  ...repackItem,
  id,
  repackCode: db2RepackItem['ORD#D'],
  runNumber: db2RepackItem['RUN#D'],
  palletId: db2RepackItem['PID#D'],
  newPalletId: db2RepackItem['PIDNEW'],
  boxesIn: `${db2RepackItem['BOX_IN']}`,
  boxesOut: `${db2RepackItem['BOX_OUT']}`,
  notes: db2RepackItem['COMMENTD'],
});

const getRepackItemId = (db2RepackItem, repackItems) => {
  const repackItem = Object.values(repackItems).find(
    (it) =>
      it.repackCode === `${db2RepackItem['ORD#D']}`.trimEnd() &&
      it.runNumber === `${db2RepackItem['RUN#D']}`.trimEnd() &&
      it.palletId === `${db2RepackItem['PID#D']}`.trimEnd() &&
      it.newPalletId === `${db2RepackItem['PIDNEW']}`.trimEnd(),
  );

  return (
    repackItem?.id ||
    `${db2RepackItem['ORD#D'].trimEnd()}-${db2RepackItem[
      'RUN#D'
    ].trimEnd()}-${db2RepackItem['PID#D'].trimEnd()}-${db2RepackItem[
      'PIDNEW'
    ].trimEnd()}`
  );
};

const repackItemOptions = {
  db2Query: `select * from JVFIL.TEMP110D;`,
  listQuery: REPACK_ITEM_LIST,
  deleteQuery: BULK_DELETE_REPACK_ITEM,
  upsertQuery: BULK_UPSERT_REPACK_ITEM,
  itemName: 'repack item',
  itemPluralName: 'repack items',
  itemQueryName: 'repackItems',
  upsertQueryName: 'repackItems',
  getUpdatedItem: getUpdatedRepackItem,
  getId: getRepackItemId,
  iterationLimit: 5000,
};

module.exports = repackItemOptions;
