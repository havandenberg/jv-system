const { gql } = require('../../../api');
const { onError } = require('../../../utils');

const ORDER_ITEM_LIST = gql`
  query ORDER_ITEM_LIST {
    orderItems {
      nodes {
        id
        itemStatus
        orderId
        backOrderId
        lineId
        palletCount
        unitSellPrice
        deliveryCharge
        isBundle
        boxCount
        productId
        locationId
        vesselCode
        jvLotNumber
        specialLotNumber
        shipperId
        isPre
        notes
      }
    }
  }
`;

const BULK_UPSERT_ORDER_ITEM = gql`
  mutation BULK_UPSERT_ORDER_ITEM($input: BulkUpsertOrderItemInput!) {
    bulkUpsertOrderItem(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_ORDER_ITEM = gql`
  mutation BULK_DELETE_ORDER_ITEM($input: BulkDeleteOrderItemInput!) {
    bulkDeleteOrderItem(input: $input) {
      clientMutationId
    }
  }
`;

// const getOrderItemLocationId = (whCode) => {
//   switch (whCode) {
// case 'AZ':
//   return '42';
// case 'EP':
//   return '39';
// case 'GR':
//   return '25';
// case 'LA':
//   return '31';
// case 'LB':
//   return '66';
// case 'NJ':
//   return '16';
//     default:
//       return whCode;
//   }
// };

const getUpdatedOrderItem = (orderItem, db2OrderItem, id) => ({
  ...orderItem,
  id,
  itemStatus: db2OrderItem['STATB'],
  orderId: `${db2OrderItem['ORD#B']}`,
  backOrderId: `${db2OrderItem['BONBRB']}`,
  lineId: `${db2OrderItem['LINE#B']}`,
  palletCount: `${db2OrderItem['NPALB']}`,
  unitSellPrice: `${db2OrderItem['SELLPB']}`,
  deliveryCharge: `${db2OrderItem['FRT$B']}`,
  isBundle: !!db2OrderItem['SORDB'],
  boxCount: `${db2OrderItem['ORDQTB']}`,
  productId: db2OrderItem['ITEMNB'],
  locationId: db2OrderItem['isPre']
    ? db2OrderItem['SRTWHB']
    : db2OrderItem['SWHS#B'],
  vesselCode: db2OrderItem['BOAT#B'],
  jvLotNumber: db2OrderItem['JVLOTB'],
  specialLotNumber: db2OrderItem['LOTSPB'],
  shipperId: db2OrderItem['isPre']
    ? db2OrderItem['CSHPRB']
    : db2OrderItem['SHPIDB'],
  isPre: db2OrderItem['isPre'],
});

const getOrderItemId = (db2OrderItem, orderItems) => {
  const orderItem = Object.values(orderItems).find(
    (it) =>
      it.orderId === `${db2OrderItem['ORD#B']}` &&
      it.backOrderId === `${db2OrderItem['BONBRB']}` &&
      it.lineId === `${db2OrderItem['LINE#B']}`,
  );

  return (
    orderItem?.id ||
    `${db2OrderItem['ORD#B']}-${db2OrderItem['BONBRB']}-${db2OrderItem['LINE#B']}`
  );
};

const orderItemOptions = {
  getDB2Items: async (db) => {
    const realOrderItems = await db
      .query('select * from JVFIL.ORDP120B;')
      .catch(onError);
    const preOrderItems = await db
      .query('select * from JVPREFIL.ORDP120B;')
      .catch(onError);
    const orderItems = [
      ...realOrderItems.map((v) => ({ ...v, isPre: false })),
      ,
      ...preOrderItems.map((v) => ({ ...v, isPre: true })),
    ];
    return orderItems;
  },
  listQuery: ORDER_ITEM_LIST,
  deleteQuery: BULK_DELETE_ORDER_ITEM,
  upsertQuery: BULK_UPSERT_ORDER_ITEM,
  itemName: 'order item',
  itemPluralName: 'order items',
  itemQueryName: 'orderItems',
  upsertQueryName: 'orderItems',
  getUpdatedItem: getUpdatedOrderItem,
  getId: getOrderItemId,
  chunkSize: 100,
  iterationLimit: 5000,
};

module.exports = orderItemOptions;
