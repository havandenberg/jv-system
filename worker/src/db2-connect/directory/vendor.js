const { gql } = require('../../api');
const { getCountryId, getPhone, getZipCode } = require('../utils');

const VENDOR_LIST = gql`
  query VENDOR_LIST {
    vendors {
      nodes {
        id
        vendorName
        address1
        address2
        city
        postalState
        zipCode
        countryId
        phone
        attention
        vendorType
        ledgerCode
        bankCode
        has1099
        id1099
        isTemp
        notes
      }
    }
  }
`;

const BULK_UPSERT_VENDOR = gql`
  mutation BULK_UPSERT_WAREHOUSE($input: BulkUpsertVendorInput!) {
    bulkUpsertVendor(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_VENDOR = gql`
  mutation BULK_DELETE_VENDOR($input: BulkDeleteVendorInput!) {
    bulkDeleteVendor(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedVendor = (vendor, db2Vendor) => ({
  ...vendor,
  id: db2Vendor['VEND#V'],
  vendorName: db2Vendor['VNAMEV'],
  address1: db2Vendor['ADD1V'],
  address2: db2Vendor['ADD2V'],
  city: db2Vendor['CITYV'],
  postalState: db2Vendor['STATEV'],
  zipCode: getZipCode(db2Vendor['ZIPCDV']),
  countryId: getCountryId(db2Vendor['CNTRYV']),
  phone: getPhone(
    db2Vendor['ARECDV'],
    db2Vendor['EXCHGV'],
    db2Vendor['PHONEV'],
  ),
  attention: db2Vendor['ATTENV'],
  vendorType: db2Vendor['VTYPEV'],
  ledgerCode: db2Vendor['GLCD1V'],
  bankCode: db2Vendor['BANKV'],
  has1099: db2Vendor['VCODEV'] !== 'N',
  id1099: db2Vendor['VDESCV'],
  isTemp: !!db2Vendor['VTEMPV'].trim(),
});

const vendorOptions = {
  db2Query: 'select * from GDSSYFIL.ACPP100V;',
  listQuery: VENDOR_LIST,
  deleteQuery: BULK_DELETE_VENDOR,
  upsertQuery: BULK_UPSERT_VENDOR,
  itemName: 'vendor',
  itemPluralName: 'vendors',
  itemQueryName: 'vendors',
  upsertQueryName: 'vendors',
  getUpdatedItem: getUpdatedVendor,
  idKey: 'VEND#V',
};

module.exports = vendorOptions;
