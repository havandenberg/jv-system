const { gql } = require('../../api');

const SHIPPER_LIST = gql`
  query SHIPPER_LIST {
    shippers {
      nodes {
        id
        shipperName
        countryId
        groupId
      }
    }
  }
`;

const BULK_UPSERT_SHIPPER = gql`
  mutation BULK_UPSERT_SHIPPER($input: BulkUpsertShipperInput!) {
    bulkUpsertShipper(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_SHIPPER = gql`
  mutation BULK_DELETE_SHIPPER($input: BulkDeleteShipperInput!) {
    bulkDeleteShipper(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedShipper = (shipper, db2Shipper) => ({
  ...shipper,
  id: db2Shipper['SHPR#K'],
  shipperName: db2Shipper['VNAMEK'],
  countryId: db2Shipper['CNTRYK'],
  groupId: db2Shipper['CMBK'],
});

const shipperOptions = {
  db2Query: 'select * from JVFIL.INVP510K;',
  listQuery: SHIPPER_LIST,
  deleteQuery: BULK_DELETE_SHIPPER,
  upsertQuery: BULK_UPSERT_SHIPPER,
  itemName: 'shipper',
  itemPluralName: 'shippers',
  itemQueryName: 'shippers',
  upsertQueryName: 'shippers',
  getUpdatedItem: getUpdatedShipper,
  idKey: 'SHPR#K',
};

module.exports = shipperOptions;
