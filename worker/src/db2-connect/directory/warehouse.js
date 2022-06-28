const { gql } = require('../../api');
const { getCountryId, getPhone, getZipCode } = require('../utils');

const WAREHOUSE_LIST = gql`
  query WAREHOUSE_LIST {
    warehouses {
      nodes {
        id
        warehouseName
        address1
        address2
        address3
        city
        postalState
        countryId
        zipCode
        phone
        outQueue
        stateTaxCode
        countyTaxCode
        cityTaxCode
        miscTaxCode
      }
    }
  }
`;

const BULK_UPSERT_WAREHOUSE = gql`
  mutation BULK_UPSERT_WAREHOUSE($input: BulkUpsertWarehouseInput!) {
    bulkUpsertWarehouse(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_WAREHOUSE = gql`
  mutation BULK_DELETE_WAREHOUSE($input: BulkDeleteWarehouseInput!) {
    bulkDeleteWarehouse(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedWarehouse = (warehouse, db2Warehouse) =>
  ['CAN'].includes(getCountryId(db2Warehouse['CTRYW']))
    ? null
    : {
        ...warehouse,
        id: db2Warehouse['WHSEW'],
        warehouseName: db2Warehouse['NAMEW'],
        address1: db2Warehouse['ADD1W'],
        address2: db2Warehouse['ADD2W'],
        address3: db2Warehouse['ADD3W'],
        city: db2Warehouse['CITYW'],
        postalState: db2Warehouse['STW'],
        countryId: getCountryId(db2Warehouse['CTRYW']),
        zipCode: getZipCode(db2Warehouse['ZIPW']),
        phone: getPhone(
          db2Warehouse['AREAW'],
          db2Warehouse['EXCHGW'],
          db2Warehouse['TEL#W'],
        ),
        outQueue: db2Warehouse['OUTQW'],
        stateTaxCode: db2Warehouse['TCDSTW'],
        countyTaxCode: db2Warehouse['TCDCTW'],
        cityTaxCode: db2Warehouse['TCDCIW'],
        miscTaxCode: db2Warehouse['TCDMTW'],
      };

const warehouseOptions = {
  db2Query: 'select * from JVFIL.INVP220W;',
  listQuery: WAREHOUSE_LIST,
  deleteQuery: BULK_DELETE_WAREHOUSE,
  upsertQuery: BULK_UPSERT_WAREHOUSE,
  itemName: 'warehouse',
  itemPluralName: 'warehouses',
  itemQueryName: 'warehouses',
  upsertQueryName: 'warehouses',
  getUpdatedItem: getUpdatedWarehouse,
  idKey: 'WHSEW',
};

module.exports = warehouseOptions;
