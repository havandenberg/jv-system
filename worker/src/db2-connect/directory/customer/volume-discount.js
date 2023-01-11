const { gql } = require('../../../api');

const CUSTOMER_VOLUME_DISCOUNT_LIST = gql`
  query CUSTOMER_VOLUME_DISCOUNT_LIST {
    customerVolumeDiscounts {
      nodes {
        id
        customerId
        volumeDiscountCode
        amount
      }
    }
  }
`;

const BULK_UPSERT_CUSTOMER_VOLUME_DISCOUNT = gql`
  mutation BULK_UPSERT_CUSTOMER(
    $input: BulkUpsertCustomerVolumeDiscountInput!
  ) {
    bulkUpsertCustomerVolumeDiscount(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_CUSTOMER_VOLUME_DISCOUNT = gql`
  mutation BULK_DELETE_CUSTOMER_VOLUME_DISCOUNT(
    $input: BulkDeleteCustomerVolumeDiscountInput!
  ) {
    bulkDeleteCustomerVolumeDiscount(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedCustomerVolumeDiscount = (
  customerVolumeDiscount,
  db2CustomerVolumeDiscount,
) => ({
  ...customerVolumeDiscount,
  customerId:
    `${db2CustomerVolumeDiscount['CUSTI'].trimEnd()}` ||
    `${db2CustomerVolumeDiscount['BCUSI'].trimEnd()}`,
  volumeDiscountCode: `${db2CustomerVolumeDiscount['VOLDCI']}`,
  amount: `${db2CustomerVolumeDiscount['VAMTI']}`,
});

const getCustomerVolumeDiscountId = (
  db2CustomerVolumeDiscount,
  customerVolumeDiscounts,
) => {
  const customerId =
    `${db2CustomerVolumeDiscount['CUSTI'].trimEnd()}` ||
    `${db2CustomerVolumeDiscount['BCUSI'].trimEnd()}`;
  const customerVolumeDiscount = Object.values(customerVolumeDiscounts).find(
    (it) =>
      it.customerId === customerId &&
      `${it.volumeDiscountCode}` === `${db2CustomerVolumeDiscount['VOLDCI']}`,
  );

  return (
    customerVolumeDiscount?.id ||
    `${customerId}-${db2CustomerVolumeDiscount['VOLDCI']}`
  );
};

const customerVolumeDiscountOptions = {
  db2Query: 'select * from JVFIL.DSSP200I;',
  listQuery: CUSTOMER_VOLUME_DISCOUNT_LIST,
  deleteQuery: BULK_DELETE_CUSTOMER_VOLUME_DISCOUNT,
  upsertQuery: BULK_UPSERT_CUSTOMER_VOLUME_DISCOUNT,
  itemName: 'customer volume discount',
  itemPluralName: 'customer volume discounts',
  itemQueryName: 'customerVolumeDiscounts',
  upsertQueryName: 'customerVolumeDiscounts',
  getUpdatedItem: getUpdatedCustomerVolumeDiscount,
  useIndexAsId: true,
  iterationLimit: 5000,
};

module.exports = customerVolumeDiscountOptions;
