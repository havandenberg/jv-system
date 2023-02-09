const { gql } = require('../../../api');
const { getDate } = require('../../utils');

const INVOICE_HEADER_LIST = gql`
  query INVOICE_HEADER_LIST {
    invoiceHeaders {
      nodes {
        id
        orderStatus
        orderId
        backOrderId
        truckLoadId
        shipWarehouseId
        invoiceId
        billingCustomerId
        salesUserCode
        customerPo
        invoiceDate
        shippingCustomerId
        orderDate
        entryDate
        actualShipDate
        expectedShipDate
        amountOwed
        paidCode
        loadLocation
        vendorId
        loadStatus
        fob
        registerNumber
        deliveryZone
        notes
      }
    }
  }
`;

const BULK_UPSERT_INVOICE_HEADER = gql`
  mutation BULK_UPSERT_INVOICE_HEADER($input: BulkUpsertInvoiceHeaderInput!) {
    bulkUpsertInvoiceHeader(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_INVOICE_HEADER = gql`
  mutation BULK_DELETE_INVOICE_HEADER($input: BulkDeleteInvoiceHeaderInput!) {
    bulkDeleteInvoiceHeader(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedInvoiceHeader = (invoiceHeader, db2InvoiceHeader, id) => ({
  ...invoiceHeader,
  id,
  orderStatus: db2InvoiceHeader['STATA'],
  orderId: `${db2InvoiceHeader['ORD#A']}`,
  backOrderId: `${db2InvoiceHeader['BONBRA']}`,
  truckLoadId: `${db2InvoiceHeader['LOAD#A']}`,
  shipWarehouseId: `${db2InvoiceHeader['PWHSEA']}`,
  invoiceId: `${db2InvoiceHeader['INV#A']}`,
  billingCustomerId: `${db2InvoiceHeader['CUSTA']}`,
  salesUserCode: `${db2InvoiceHeader['SLSMCA']}`,
  customerPo: `${db2InvoiceHeader['CPO#A']}`,
  invoiceDate: getDate(
    db2InvoiceHeader['INVDDA'],
    db2InvoiceHeader['INVMMA'],
    db2InvoiceHeader['INVYYA'],
  ),
  shippingCustomerId: `${db2InvoiceHeader['SHP#A']}`,
  orderDate: getDate(
    db2InvoiceHeader['CORDDA'],
    db2InvoiceHeader['CORMMA'],
    db2InvoiceHeader['CORYYA'],
  ),
  entryDate: getDate(
    db2InvoiceHeader['ENTDDA'],
    db2InvoiceHeader['ENTMMA'],
    db2InvoiceHeader['ENTYYA'],
  ),
  actualShipDate: getDate(
    db2InvoiceHeader['ASPDDA'],
    db2InvoiceHeader['ASPMMA'],
    db2InvoiceHeader['ASPYYA'],
  ),
  expectedShipDate: getDate(
    db2InvoiceHeader['SHPDDA'],
    db2InvoiceHeader['SHPMMA'],
    db2InvoiceHeader['SHPYYA'],
  ),
  amountOwed: `${db2InvoiceHeader['INV$A']}`,
  paidCode: `${db2InvoiceHeader['PAIDA']}`,
  loadLocation: `${db2InvoiceHeader['LDLOCA']}`,
  vendorId: `${db2InvoiceHeader['TRKIDA']}`,
  loadStatus: `${db2InvoiceHeader['LDSTSA']}`,
  fob: db2InvoiceHeader['FOBA'] === 'F',
  registerNumber: `${db2InvoiceHeader['REG#A']}`,
  deliveryZone: `${db2InvoiceHeader['DLZNA']}`,
});

const getInvoiceHeaderId = (db2InvoiceHeader, invoiceHeaders) => {
  const invoiceHeader = Object.values(invoiceHeaders).find(
    (it) =>
      it.orderId === `${db2InvoiceHeader['ORD#A']}` &&
      it.backOrderId === `${db2InvoiceHeader['BONBRA']}`,
  );

  return (
    invoiceHeader?.id ||
    `${db2InvoiceHeader['ORD#A']}-${db2InvoiceHeader['BONBRA']}`
  );
};

const invoiceHeaderOptions = {
  db2Query: `select * from JVFIL.ORDP900A;`,
  listQuery: INVOICE_HEADER_LIST,
  deleteQuery: BULK_DELETE_INVOICE_HEADER,
  upsertQuery: BULK_UPSERT_INVOICE_HEADER,
  itemName: 'invoice header',
  itemPluralName: 'invoice headers',
  itemQueryName: 'invoiceHeaders',
  upsertQueryName: 'invoiceHeaders',
  getUpdatedItem: getUpdatedInvoiceHeader,
  getId: getInvoiceHeaderId,
  chunkSize: 100,
  iterationLimit: 12000,
};

module.exports = invoiceHeaderOptions;
