const { gql } = require('../../../api');
const { getDateTime } = require('../../utils');

const INVOICE_ITEM_HISTORY_LIST = gql`
  query INVOICE_ITEM_HISTORY_LIST {
    invoiceItemHistories {
      nodes {
        id
        orderId
        backOrderId
        lineId
        sequenceId
        palletId
        pickedQty
        conditionCode
        creditCode
        unitSellPrice
        priceAdjustment
        deliveryCharge
        freightAdjustment
        brokerageAmount
        miaAdjustment
        volumeDiscountAmount
        updatedAt
      }
    }
  }
`;

const BULK_UPSERT_INVOICE_ITEM_HISTORY = gql`
  mutation BULK_UPSERT_INVOICE_ITEM_HISTORY(
    $input: BulkUpsertInvoiceItemHistoryInput!
  ) {
    bulkUpsertInvoiceItemHistory(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_INVOICE_ITEM_HISTORY = gql`
  mutation BULK_DELETE_INVOICE_ITEM_HISTORY(
    $input: BulkDeleteInvoiceItemHistoryInput!
  ) {
    bulkDeleteInvoiceItemHistory(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedInvoiceItemHistory = (
  invoiceItemHistory,
  db2InvoiceItemHistory,
  id,
) => ({
  ...invoiceItemHistory,
  id,
  orderId: `${db2InvoiceItemHistory['ORDNOH']}`,
  backOrderId: `${db2InvoiceItemHistory['BO#H']}`,
  lineId: `${db2InvoiceItemHistory['LINE#H']}`,
  sequenceId: `${db2InvoiceItemHistory['SEQ#H']}`,
  palletId: `${db2InvoiceItemHistory['PID#H']}`,
  pickedQty: `${db2InvoiceItemHistory['SHPQTH']}`,
  conditionCode: `${db2InvoiceItemHistory['CONCDH']}`,
  creditCode: `${db2InvoiceItemHistory['CRCODH']}`,
  unitSellPrice: `${db2InvoiceItemHistory['SELLPH']}`,
  priceAdjustment: `${db2InvoiceItemHistory['ADJH']}`,
  deliveryCharge: `${db2InvoiceItemHistory['FRTH']}`,
  freightAdjustment: `${db2InvoiceItemHistory['ADJFH']}`,
  brokerageAmount: `${db2InvoiceItemHistory['BRKRGH']}`,
  miaAdjustment: `${db2InvoiceItemHistory['MIAH']}`,
  volumeDiscountAmount: `${db2InvoiceItemHistory['VLD1H']}`,
  updatedAt: getDateTime(
    `${db2InvoiceItemHistory['CHGDTH']}`,
    `${db2InvoiceItemHistory['CHGTIH']}`,
  ),
});

const invoiceItemHistoryOptions = {
  db2Query: `select * from JVFIL.ORDP170H;`,
  listQuery: INVOICE_ITEM_HISTORY_LIST,
  deleteQuery: BULK_DELETE_INVOICE_ITEM_HISTORY,
  upsertQuery: BULK_UPSERT_INVOICE_ITEM_HISTORY,
  itemName: 'invoice item history',
  itemPluralName: 'invoice item histories',
  itemQueryName: 'invoiceItemHistories',
  upsertQueryName: 'invoiceItemHistories',
  getUpdatedItem: getUpdatedInvoiceItemHistory,
  useIndexAsId: true,
};

module.exports = invoiceItemHistoryOptions;
