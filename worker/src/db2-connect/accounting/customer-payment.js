const { gql } = require('../../api');

const CUSTOMER_PAYMENT_LIST = gql`
  query CUSTOMER_PAYMENT_LIST {
    customerPayments {
      nodes {
        id
        invoiceId
        checkNumber
        transactionCode
        transactionType
        netAmountDue
        notes
      }
    }
  }
`;

const BULK_UPSERT_CUSTOMER_PAYMENT = gql`
  mutation BULK_UPSERT_CUSTOMER_PAYMENT(
    $input: BulkUpsertCustomerPaymentInput!
  ) {
    bulkUpsertCustomerPayment(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_CUSTOMER_PAYMENT = gql`
  mutation BULK_DELETE_CUSTOMER_PAYMENT(
    $input: BulkDeleteCustomerPaymentInput!
  ) {
    bulkDeleteCustomerPayment(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedCustomerPayment = (
  customerPayment,
  db2CustomerPayment,
  id,
) => ({
  ...customerPayment,
  id,
  invoiceId: `${db2CustomerPayment['RINVNO']}`,
  checkNumber: `${db2CustomerPayment['RCKNUM']}`,
  transactionCode: db2CustomerPayment['RTRNCD'],
  transactionType: `${db2CustomerPayment['RTRNTY']}`,
  netAmountDue: `${db2CustomerPayment['RAMT']}`,
  notes: db2CustomerPayment['RREMRK'],
});

const customerPaymentOptions = {
  db2Query: `select * from GDSSYFIL.ACRP100R;`,
  listQuery: CUSTOMER_PAYMENT_LIST,
  deleteQuery: BULK_DELETE_CUSTOMER_PAYMENT,
  upsertQuery: BULK_UPSERT_CUSTOMER_PAYMENT,
  itemName: 'customer payment',
  itemPluralName: 'customer payments',
  itemQueryName: 'customerPayments',
  upsertQueryName: 'customerPayments',
  getUpdatedItem: getUpdatedCustomerPayment,
  useIndexAsId: true,
  iterationLimit: 5000,
};

module.exports = customerPaymentOptions;
