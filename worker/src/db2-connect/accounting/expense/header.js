const { gql } = require('../../../api');
const { getDate } = require('../../utils');

const EXPENSE_HEADER_LIST = gql`
  query EXPENSE_HEADER_LIST {
    expenseHeaders {
      nodes {
        id
        vendorId
        voucherId
        invoiceId
        isEstimated
        paidCode
        receivableCut
        apHide
        isProrate
        expenseAmount
        checkNumber
        entryDate
        expenseCode
        truckLoadId
        vesselCode
        customsEntryCode
        notes
      }
    }
  }
`;

const BULK_UPSERT_EXPENSE_HEADER = gql`
  mutation BULK_UPSERT_EXPENSE_HEADER($input: BulkUpsertExpenseHeaderInput!) {
    bulkUpsertExpenseHeader(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_EXPENSE_HEADER = gql`
  mutation BULK_DELETE_EXPENSE_HEADER($input: BulkDeleteExpenseHeaderInput!) {
    bulkDeleteExpenseHeader(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedExpenseHeader = (expenseHeader, db2ExpenseHeader, id) => ({
  ...expenseHeader,
  id,
  vendorId: `${db2ExpenseHeader['VEND#A']}`,
  voucherId: `${db2ExpenseHeader['VOCH#A']}`,
  invoiceId: `${db2ExpenseHeader['APINVA']}`,
  isEstimated: `${db2ExpenseHeader['ESTA']}` === 'Y',
  paidCode: `${db2ExpenseHeader['PAIDA']}`,
  receivableCut: `${db2ExpenseHeader['ARA']}` === 'R',
  apHide: db2ExpenseHeader['NOAPA'] === 'X',
  isProrate: db2ExpenseHeader['PROA'] === 'P',
  expenseAmount: `${db2ExpenseHeader['AMTA']}`,
  checkNumber: `${db2ExpenseHeader['CHKA']}`,
  entryDate: getDate(
    db2ExpenseHeader['ENTDDA'],
    db2ExpenseHeader['ENTMMA'],
    db2ExpenseHeader['ENTYYA'],
  ),
  expenseCode: `${db2ExpenseHeader['EXPA']}`,
  truckLoadId: `${db2ExpenseHeader['LOADA']}`,
  vesselCode: `${db2ExpenseHeader['BOATA']}`,
  customsEntryCode: `${db2ExpenseHeader['ENTRYA']}`,
});

const getExpenseHeaderId = (db2ExpenseHeader, expenseHeaders) => {
  const expenseHeader = Object.values(expenseHeaders).find(
    (it) =>
      it.vendorId === `${db2ExpenseHeader['VEND#A']}`.trimEnd() &&
      it.voucherId === `${db2ExpenseHeader['VOCH#A']}`.trimEnd(),
  );

  return (
    expenseHeader?.id ||
    `${db2ExpenseHeader['VEND#A'].trimEnd()}-${db2ExpenseHeader[
      'VOCH#A'
    ].trimEnd()}`
  );
};

const expenseHeaderOptions = {
  db2Query: `select * from JVFIL.EXPP100A;`,
  listQuery: EXPENSE_HEADER_LIST,
  deleteQuery: BULK_DELETE_EXPENSE_HEADER,
  upsertQuery: BULK_UPSERT_EXPENSE_HEADER,
  itemName: 'expense header',
  itemPluralName: 'expense headers',
  itemQueryName: 'expenseHeaders',
  upsertQueryName: 'expenseHeaders',
  getUpdatedItem: getUpdatedExpenseHeader,
  getId: getExpenseHeaderId,
  chunkSize: 100,
  iterationLimit: 5000,
};

module.exports = expenseHeaderOptions;
