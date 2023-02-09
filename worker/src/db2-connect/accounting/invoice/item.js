const { gql } = require('../../../api');

const INVOICE_ITEM_LIST = gql`
  query INVOICE_ITEM_LIST {
    invoiceItems {
      nodes {
        id
        palletStatus
        orderId
        backOrderId
        lineId
        sequenceId
        pickedQty
        creditedQty
        palletId
        conditionCode
        creditCode
        unitSellPrice
        priceAdjustment
        deliveryCharge
        freightAdjustment
        creditAmount
        brokerageAmount
        volumeDiscountAmount
        miaAdjustment
        layerMult
        flag
        notes
      }
    }
  }
`;

const BULK_UPSERT_INVOICE_ITEM = gql`
  mutation BULK_UPSERT_INVOICE_ITEM($input: BulkUpsertInvoiceItemInput!) {
    bulkUpsertInvoiceItem(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_INVOICE_ITEM = gql`
  mutation BULK_DELETE_INVOICE_ITEM($input: BulkDeleteInvoiceItemInput!) {
    bulkDeleteInvoiceItem(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedInvoiceItem = (invoiceItem, db2InvoiceItem, id) => ({
  ...invoiceItem,
  id,
  palletStatus: db2InvoiceItem['STATU'],
  orderId: `${db2InvoiceItem['ORDNOU']}`,
  backOrderId: `${db2InvoiceItem['BO#U']}`,
  lineId: `${db2InvoiceItem['LINE#U']}`,
  sequenceId: `${db2InvoiceItem['SEQ#U']}`,
  pickedQty: `${db2InvoiceItem['SHPQTU']}`,
  creditedQty: `${db2InvoiceItem['CCLQTU']}`,
  palletId: `${db2InvoiceItem['PID#U']}`,
  conditionCode: `${db2InvoiceItem['CONCDU']}`,
  creditCode: `${db2InvoiceItem['CRCODU']}`,
  unitSellPrice: `${db2InvoiceItem['SELLPU']}`,
  priceAdjustment: `${db2InvoiceItem['ADJU']}`,
  deliveryCharge: `${db2InvoiceItem['FRTU']}`,
  freightAdjustment: `${db2InvoiceItem['ADJFU']}`,
  creditAmount: `${db2InvoiceItem['CRAMTU']}`,
  brokerageAmount: `${db2InvoiceItem['BRKRGU']}`,
  volumeDiscountAmount: `${db2InvoiceItem['VLD1U']}`,
  miaAdjustment: `${db2InvoiceItem['MIAU']}`,
  layerMult: db2InvoiceItem['LAYERU'] === 1,
  flag: `${db2InvoiceItem['FLAG5U']}`,
});

const getInvoiceItemId = (db2InvoiceItem, invoiceItems) => {
  const invoiceItem = Object.values(invoiceItems).find(
    (it) =>
      it.orderId === `${db2InvoiceItem['ORDNOU']}` &&
      it.backOrderId === `${db2InvoiceItem['BO#U']}` &&
      it.lineId === `${db2InvoiceItem['LINE#U']}` &&
      it.sequenceId === `${db2InvoiceItem['SEQ#U']}`,
  );

  return (
    invoiceItem?.id ||
    `${db2InvoiceItem['ORDNOU']}-${db2InvoiceItem['BO#U']}-${db2InvoiceItem['LINE#U']}-${db2InvoiceItem['SEQ#U']}`
  );
};

const invoiceItemOptions = {
  db2Query: `select * from JVFIL.ORDP170U;`,
  listQuery: INVOICE_ITEM_LIST,
  deleteQuery: BULK_DELETE_INVOICE_ITEM,
  upsertQuery: BULK_UPSERT_INVOICE_ITEM,
  itemName: 'invoice item',
  itemPluralName: 'invoice items',
  itemQueryName: 'invoiceItems',
  upsertQueryName: 'invoiceItems',
  getUpdatedItem: getUpdatedInvoiceItem,
  getId: getInvoiceItemId,
  chunkSize: 100,
  iterationLimit: 5000,
};

module.exports = invoiceItemOptions;
