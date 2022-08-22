const { gql } = require('../../../api');
const { getDate } = require('../../utils');

const ORDER_MASTER_LIST = gql`
  query ORDER_MASTER_LIST {
    orderMasters {
      nodes {
        id
        orderStatus
        paidCode
        loadStatus
        orderId
        backOrderId
        shipWarehouseId
        truckLoadId
        fob
        billingCustomerId
        salesUserCode
        customerPo
        expectedShipDate
        orderDate
        entryDate
        actualShipDate
        invoiceDate
        shippingCustomerId
        entryUserCode
        registerNumber
        deliveryZone
        amountOwed
        loadLocation
        vendorId
        invoiceId
        notes
      }
    }
  }
`;

const BULK_UPSERT_ORDER_MASTER = gql`
  mutation BULK_UPSERT_ORDER_MASTER($input: BulkUpsertOrderMasterInput!) {
    bulkUpsertOrderMaster(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_ORDER_MASTER = gql`
  mutation BULK_DELETE_ORDER_MASTER($input: BulkDeleteOrderMasterInput!) {
    bulkDeleteOrderMaster(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedOrderMaster = (orderMaster, db2OrderMaster, id) => ({
  ...orderMaster,
  id,
  orderStatus: db2OrderMaster['STATA'],
  paidCode: !!db2OrderMaster['PAIDA'],
  loadStatus: db2OrderMaster['LDSTSA'],
  orderId: `${db2OrderMaster['ORD#A']}`,
  backOrderId: `${db2OrderMaster['BONBRA']}`,
  shipWarehouseId: db2OrderMaster['PWHSEA'],
  truckLoadId: db2OrderMaster['LOAD#A'],
  fob: db2OrderMaster['FOBA'] === 'F',
  billingCustomerId: db2OrderMaster['CUSTA'],
  salesUserCode: db2OrderMaster['SLSMCA'],
  customerPo: db2OrderMaster['CPO#A'],
  expectedShipDate: getDate(
    db2OrderMaster['SHPDDA'],
    db2OrderMaster['SHPMMA'],
    db2OrderMaster['SHPYYA'],
  ),
  orderDate: getDate(
    db2OrderMaster['CORDDA'],
    db2OrderMaster['CORMMA'],
    db2OrderMaster['CORYYA'],
  ),
  entryDate: getDate(
    db2OrderMaster['ENTDDA'],
    db2OrderMaster['ENTMMA'],
    db2OrderMaster['ENTYYA'],
  ),
  actualShipDate: getDate(
    db2OrderMaster['ASPDDA'],
    db2OrderMaster['ASPMMA'],
    db2OrderMaster['ASPYYA'],
  ),
  invoiceDate: getDate(
    db2OrderMaster['INVDDA'],
    db2OrderMaster['INVMMA'],
    db2OrderMaster['INVYYA'],
  ),
  shippingCustomerId: db2OrderMaster['SHP#A'],
  entryUserCode: db2OrderMaster['USRIDA'],
  registerNumber: `${db2OrderMaster['REG#A']}`,
  deliveryZone: db2OrderMaster['DLZNA'],
  amountOwed: `${db2OrderMaster['INV$A']}`,
  loadLocation: db2OrderMaster['LDLOCA'],
  vendorId: db2OrderMaster['TRKIDA'],
  invoiceId: db2OrderMaster['INV#A'],
});

const getOrderMasterId = (db2OrderMaster, orderMasters) => {
  const orderMaster = Object.values(orderMasters).find(
    (it) =>
      it.orderId === `${db2OrderMaster['ORD#A']}` &&
      it.backOrderId === `${db2OrderMaster['BONBRA']}`,
  );

  return (
    orderMaster?.id || `${db2OrderMaster['ORD#A']}-${db2OrderMaster['BONBRA']}`
  );
};

const orderMasterOptions = {
  db2Query: `select * from JVFIL.ORDP100A;`,
  listQuery: ORDER_MASTER_LIST,
  deleteQuery: BULK_DELETE_ORDER_MASTER,
  upsertQuery: BULK_UPSERT_ORDER_MASTER,
  itemName: 'order master',
  itemPluralName: 'order masters',
  itemQueryName: 'orderMasters',
  upsertQueryName: 'orderMasters',
  getUpdatedItem: getUpdatedOrderMaster,
  getId: getOrderMasterId,
  chunkSize: 100,
  iterationLimit: 5000,
};

module.exports = orderMasterOptions;
