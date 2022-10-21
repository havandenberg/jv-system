const { gql } = require('../../../api');

const EXPENSE_ITEM_LIST = gql`
  query EXPENSE_ITEM_LIST {
    expenseItems {
      nodes {
        id
        vendorId
        voucherId
        sequenceId
        quantity
        unitPrice
        itemAmount
        billOfLadingId
        productCode
        palletId
        shipperId
        expenseCode
        vesselCode
        notes
      }
    }
  }
`;

const BULK_UPSERT_EXPENSE_ITEM = gql`
  mutation BULK_UPSERT_EXPENSE_ITEM($input: BulkUpsertExpenseItemInput!) {
    bulkUpsertExpenseItem(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_EXPENSE_ITEM = gql`
  mutation BULK_DELETE_EXPENSE_ITEM($input: BulkDeleteExpenseItemInput!) {
    bulkDeleteExpenseItem(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedExpenseItem = (expenseItem, db2ExpenseItem, id) => ({
  ...expenseItem,
  id,
  vendorId: `${db2ExpenseItem['VEND#B'].trimEnd()}`,
  voucherId: `${db2ExpenseItem['VOCH#B'].trimEnd()}`,
  sequenceId: `${db2ExpenseItem['SEQB']}`,
  quantity: `${db2ExpenseItem['QTYB']}`,
  unitPrice: `${db2ExpenseItem['PRICEB']}`,
  itemAmount: `${db2ExpenseItem['AMTB']}`,
  billOfLadingId: `${db2ExpenseItem['BOLB']}`,
  productCode: `${db2ExpenseItem['PRODB']}`,
  palletId: `${db2ExpenseItem['PID#B']}`,
  shipperId: `${db2ExpenseItem['SHPRB']}`,
  expenseCode: `${db2ExpenseItem['EXPB']}`,
  vesselCode: `${db2ExpenseItem['BOATB']}`,
});

const getExpenseItemId = (db2ExpenseItem, expenseItems) => {
  const expenseItem = Object.values(expenseItems).find(
    (it) =>
      it.vendorId === `${db2ExpenseItem['VEND#B']}`.trimEnd() &&
      it.voucherId === `${db2ExpenseItem['VOCH#B']}`.trimEnd() &&
      it.sequenceId === `${db2ExpenseItem['SEQB']}`,
  );

  return (
    expenseItem?.id ||
    `${db2ExpenseItem['VEND#B'].trimEnd()}-${db2ExpenseItem[
      'VOCH#B'
    ].trimEnd()}-${db2ExpenseItem['SEQB']}`
  );
};

const expenseItemOptions = {
  db2Query: `select * from JVFIL.EXPP120B;`,
  listQuery: EXPENSE_ITEM_LIST,
  deleteQuery: BULK_DELETE_EXPENSE_ITEM,
  upsertQuery: BULK_UPSERT_EXPENSE_ITEM,
  itemName: 'expense item',
  itemPluralName: 'expense items',
  itemQueryName: 'expenseItems',
  upsertQueryName: 'expenseItems',
  getUpdatedItem: getUpdatedExpenseItem,
  getId: getExpenseItemId,
  chunkSize: 100,
};

module.exports = expenseItemOptions;
