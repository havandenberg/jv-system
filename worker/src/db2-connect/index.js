const ibmdb = require('ibm_db');
const { onError } = require('../utils');
const db2UpdateItems = require('./update-items');
const checkHeaderOptions = require('./accounting/check-header');
const customerPaymentOptions = require('./accounting/customer-payment');
const expenseHeaderOptions = require('./accounting/expense/header');
const expenseItemOptions = require('./accounting/expense/item');
const invoiceHeaderOptions = require('./accounting/invoice/header');
const invoiceItemOptions = require('./accounting/invoice/item');
const invoiceItemHistoryOptions = require('./accounting/invoice/item-history');
const countryOptions = require('./directory/country');
const customerOptions = require('./directory/customer');
const customerVolumeDiscountOptions = require('./directory/customer/volume-discount');
const shipperOptions = require('./directory/shipper');
const warehouseOptions = require('./directory/warehouse');
const vendorOptions = require('./directory/vendor');
const inventoryItemOptions = require('./product/inventory-item');
const { palletOptions, palletSectionOptions } = require('./product/pallet');
const vesselOptions = require('./product/vessel');
const orderMasterOptions = require('./operations/order/master');
const orderItemOptions = require('./operations/order/item');
const orderCommentOptions = require('./operations/order/comment');
const repackHeaderOptions = require('./operations/repack/header');
const repackItemOptions = require('./operations/repack/item');
const truckLoadOptions = require('./operations/truck-load');
const productMasterOptions = require('./product/master');
const speciesOptions = require('./product/species');
const varietyOptions = require('./product/variety');
const sizeOptions = require('./product/size');
const packTypeOptions = require('./product/pack-type');
const repackStyleOptions = require('./product/repack-style');

const db2RunQuery = (tableName, db) => {
  switch (tableName) {
    case 'accounting/check-header':
      return db2UpdateItems(db, checkHeaderOptions);
    case 'accounting/customer-payment':
      return db2UpdateItems(db, customerPaymentOptions);
    case 'accounting/invoice/header':
      return db2UpdateItems(db, invoiceHeaderOptions);
    case 'accounting/invoice/item':
      return db2UpdateItems(db, invoiceItemOptions);
    case 'accounting/invoice/item-history':
      return db2UpdateItems(db, invoiceItemHistoryOptions);
    case 'accounting/expense/header':
      return db2UpdateItems(db, expenseHeaderOptions);
    case 'accounting/expense/item':
      return db2UpdateItems(db, expenseItemOptions);
    case 'directory/country':
      return db2UpdateItems(db, countryOptions);
    case 'directory/customer':
      return db2UpdateItems(db, customerOptions);
    case 'directory/customer/volume-discount':
      return db2UpdateItems(db, customerVolumeDiscountOptions);
    case 'directory/shipper':
      return db2UpdateItems(db, shipperOptions);
    case 'directory/warehouse':
      return db2UpdateItems(db, warehouseOptions);
    case 'directory/vendor':
      return db2UpdateItems(db, vendorOptions);
    case 'product/inventory-item':
      return db2UpdateItems(db, inventoryItemOptions);
    case 'product/pallet':
      return db2UpdateItems(db, palletOptions);
    case 'product/pallet-section':
      return db2UpdateItems(db, palletSectionOptions);
    case 'product/vessel':
      return db2UpdateItems(db, vesselOptions);
    case 'operations/order/master':
      return db2UpdateItems(db, orderMasterOptions);
    case 'operations/order/item':
      return db2UpdateItems(db, orderItemOptions);
    case 'operations/order/comment':
      return db2UpdateItems(db, orderCommentOptions);
    case 'operations/repack/header':
      return db2UpdateItems(db, repackHeaderOptions);
    case 'operations/repack/item':
      return db2UpdateItems(db, repackItemOptions);
    case 'operations/truck-load':
      return db2UpdateItems(db, truckLoadOptions);
    case 'product/master':
      return db2UpdateItems(db, productMasterOptions);
    case 'product/species':
      return db2UpdateItems(db, speciesOptions);
    case 'product/variety':
      return db2UpdateItems(db, varietyOptions);
    case 'product/size':
      return db2UpdateItems(db, sizeOptions);
    case 'product/pack-atmosphere':
      return db2UpdateItems(db, packTypeOptions.packAtmosphereOptions);
    case 'product/pack-box-style':
      return db2UpdateItems(db, packTypeOptions.packBoxStyleOptions);
    case 'product/pack-box-type':
      return db2UpdateItems(db, packTypeOptions.packBoxTypeOptions);
    case 'product/pack-destination':
      return db2UpdateItems(db, packTypeOptions.packDestinationOptions);
    case 'product/pack-grade':
      return db2UpdateItems(db, packTypeOptions.packGradeOptions);
    case 'product/pack-hold':
      return db2UpdateItems(db, packTypeOptions.packHoldOptions);
    case 'product/pack-label':
      return db2UpdateItems(db, packTypeOptions.packLabelOptions);
    case 'product/pack-liner':
      return db2UpdateItems(db, packTypeOptions.packLinerOptions);
    case 'product/pack-out':
      return db2UpdateItems(db, packTypeOptions.packOutOptions);
    case 'product/pack-pallet-type':
      return db2UpdateItems(db, packTypeOptions.packPalletTypeOptions);
    case 'product/pack-production':
      return db2UpdateItems(db, packTypeOptions.packProductionOptions);
    case 'product/pack-special':
      return db2UpdateItems(db, packTypeOptions.packSpecialOptions);
    case 'product/pack-style':
      return db2UpdateItems(db, packTypeOptions.packStyleOptions);
    case 'product/pack-tree-ripe':
      return db2UpdateItems(db, packTypeOptions.packTreeRipeOptions);
    case 'product/pack-master':
      return db2UpdateItems(db, packTypeOptions.packMasterOptions);
    case 'product/repack-style':
      return db2UpdateItems(db, repackStyleOptions);
    default:
      return db.query('select 1 from sysibm.sysdummy1;');
  }
};

const db2UpdateTable = (tableName) => {
  ibmdb
    .open(process.env.DB2_CONNECT_STRING)
    .then((db) =>
      db2RunQuery(tableName, db)
        .then(() => {
          db.closeSync();
        })
        .catch(onError),
    )
    .catch(onError);
};

module.exports = {
  db2UpdateTable,
};
