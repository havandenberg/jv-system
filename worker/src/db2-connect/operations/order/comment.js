const { gql } = require('../../../api');

const ORDER_COMMENT_LIST = gql`
  query ORDER_COMMENT_LIST {
    orderComments {
      nodes {
        id
        orderId
        backOrderId
        lineId
        printCode
        notes
      }
    }
  }
`;

const BULK_UPSERT_ORDER_COMMENT = gql`
  mutation BULK_UPSERT_ORDER_COMMENT($input: BulkUpsertOrderCommentInput!) {
    bulkUpsertOrderComment(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_ORDER_COMMENT = gql`
  mutation BULK_DELETE_ORDER_COMMENT($input: BulkDeleteOrderCommentInput!) {
    bulkDeleteOrderComment(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedOrderComment = (orderComment, db2OrderComment, id) => ({
  ...orderComment,
  id,
  orderId: `${db2OrderComment['ORD#C']}`,
  backOrderId: `${db2OrderComment['BONBRC']}`,
  lineId: `${db2OrderComment['SEQC']}`,
  printCode: `${db2OrderComment['PRTC']}`,
  notes: db2OrderComment['COMMC'],
});

const orderCommentOptions = {
  db2Query: `select * from GDSDSFIL.ORDP140C;`,
  listQuery: ORDER_COMMENT_LIST,
  deleteQuery: BULK_DELETE_ORDER_COMMENT,
  upsertQuery: BULK_UPSERT_ORDER_COMMENT,
  itemName: 'order comment',
  itemPluralName: 'order comments',
  itemQueryName: 'orderComments',
  upsertQueryName: 'orderComments',
  getUpdatedItem: getUpdatedOrderComment,
  useIndexAsId: true,
  chunkSize: 100,
  iterationLimit: 5000,
};

module.exports = orderCommentOptions;
