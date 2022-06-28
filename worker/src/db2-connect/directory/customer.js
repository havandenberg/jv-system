const { gql } = require('../../api');
const { getActive, getCountryId, getPhone, getZipCode } = require('../utils');

const CUSTOMER_LIST = gql`
  query CUSTOMER_LIST {
    customers(orderBy: ID_ASC) {
      nodes {
        id
        customerName
        address1
        address2
        city
        postalState
        zipCode
        countryId
        phone
        active
      }
    }
  }
`;

const BULK_UPSERT_CUSTOMER = gql`
  mutation BULK_UPSERT_CUSTOMER($input: BulkUpsertCustomerInput!) {
    bulkUpsertCustomer(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_CUSTOMER = gql`
  mutation BULK_DELETE_CUSTOMER($input: BulkDeleteCustomerInput!) {
    bulkDeleteCustomer(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedCustomer = (customer, db2Customer) =>
  !getActive(db2Customer['CDELCD']) ||
  [
    '.',
    'CAN',
    'HOL',
    'FRN',
    'DEN',
    'ICE',
    'GER',
    'IRE',
    'NOR',
    'BLG',
    'UK',
    'GRC',
  ].includes(getCountryId(db2Customer['CNTRYC'])) ||
  db2Customer['CUST#C'] === null
    ? null
    : {
        ...customer,
        id: db2Customer['CUST#C'],
        customerName: db2Customer['CUSNMC'],
        address1: db2Customer['ADRESC'],
        address2: db2Customer['ADRS2C'],
        city: db2Customer['CITYC'],
        postalState: db2Customer['STATEC'],
        zipCode: getZipCode(db2Customer['ZIPCDC']),
        countryId: getCountryId(db2Customer['CNTRYC']),
        phone: getPhone(
          db2Customer['AREAC'],
          db2Customer['EXCHGC'],
          db2Customer['TEL#C'],
        ),
        active: getActive(db2Customer['CDELCD']),
      };

const customerOptions = {
  db2Query: 'select * from GDSSYFIL.DSSP200C order by CUST#C asc;',
  listQuery: CUSTOMER_LIST,
  deleteQuery: BULK_DELETE_CUSTOMER,
  upsertQuery: BULK_UPSERT_CUSTOMER,
  itemName: 'customer',
  itemPluralName: 'customers',
  itemQueryName: 'customers',
  upsertQueryName: 'customers',
  getUpdatedItem: getUpdatedCustomer,
  idKey: 'CUST#C',
  iterationLimit: 5000,
};

module.exports = customerOptions;
