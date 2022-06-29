const { gql } = require('../../api');

const INVENTORY_ITEM_LIST = gql`
  query INVENTORY_ITEM_LIST {
    inventoryItems {
      nodes {
        id
        productId
        locationId
        vesselCode
        jvLotNumber
        shipperId
        palletsReceived
        palletsCommitted
        palletsOnHand
        palletsAvailable
        palletsShipped
        palletsTransferredIn
        palletsTransferredOut
        plu
        countryId
        specialLotNumber
        coast
        storageRank
        warehouseId
      }
    }
  }
`;

const BULK_UPSERT_INVENTORY_ITEM = gql`
  mutation BULK_UPSERT_INVENTORY_ITEM($input: BulkUpsertInventoryItemInput!) {
    bulkUpsertInventoryItem(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_INVENTORY_ITEM = gql`
  mutation BULK_DELETE_INVENTORY_ITEM($input: BulkDeleteInventoryItemInput!) {
    bulkDeleteInventoryItem(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedInventoryItem = (inventoryItem, db2InventoryItem, id) => ({
  ...inventoryItem,
  id,
  productId: db2InventoryItem['PROD#X'],
  locationId: db2InventoryItem['SRTWHX'] || db2InventoryItem['PLOC#X'],
  vesselCode: db2InventoryItem['BOAT#X'],
  jvLotNumber: db2InventoryItem['JVLOTX'],
  shipperId: db2InventoryItem['CSHPRX'] || db2InventoryItem['SHPR#X'],
  palletsReceived: `${db2InventoryItem['PRCVX']}`,
  palletsCommitted: `${db2InventoryItem['PCOMX']}`,
  palletsOnHand: `${db2InventoryItem['PONHX']}`,
  palletsAvailable: `${db2InventoryItem['PAVLX']}`,
  palletsShipped: `${db2InventoryItem['PSHPX']}`,
  palletsTransferredIn: `${db2InventoryItem['PXFRIX']}`,
  palletsTransferredOut: `${db2InventoryItem['PXFROX']}`,
  plu: !!db2InventoryItem['PLUX'],
  countryId: db2InventoryItem['CNTRYX'] || db2InventoryItem['CMBLX'],
  specialLotNumber: db2InventoryItem['LOTSPX'],
  coast: db2InventoryItem['REGX'] ? 'WC' : 'EC',
  storageRank: db2InventoryItem['INVWKX'],
  warehouseId: db2InventoryItem['SRTWHX'],
});

const getInventoryItemId = (db2InventoryItem, inventoryItems) => {
  const inventoryItem = Object.values(inventoryItems).find(
    (it) =>
      it.productId === db2InventoryItem['PROD#X'].trimEnd() &&
      it.locationId === db2InventoryItem['PLOC#X'].trimEnd() &&
      it.vesselCode === db2InventoryItem['BOAT#X'].trimEnd() &&
      it.jvLotNumber === db2InventoryItem['JVLOTX'].trimEnd() &&
      it.shipperId ===
        (db2InventoryItem['CSHPRX'] || db2InventoryItem['SHPR#X']).trimEnd(),
  );

  return (
    inventoryItem?.id ||
    `${db2InventoryItem['PROD#X'].trimEnd()}-${db2InventoryItem[
      'PLOC#X'
    ].trimEnd()}-${db2InventoryItem['BOAT#X'].trimEnd()}-${db2InventoryItem[
      'JVLOTX'
    ].trimEnd()}-${(
      db2InventoryItem['CSHPRX'] || db2InventoryItem['SHPR#X']
    ).trimEnd()}`
  );
};

const inventoryItemOptions = {
  db2Query: `select * from JVFIL.ORDP730X union select * from JVPREFIL.ORDP730X;`,
  listQuery: INVENTORY_ITEM_LIST,
  deleteQuery: BULK_DELETE_INVENTORY_ITEM,
  upsertQuery: BULK_UPSERT_INVENTORY_ITEM,
  itemName: 'inventory item',
  itemPluralName: 'inventory items',
  itemQueryName: 'inventoryItems',
  upsertQueryName: 'inventoryItems',
  getUpdatedItem: getUpdatedInventoryItem,
  getId: getInventoryItemId,
  chunkSize: 100,
  iterationLimit: 30000,
};

module.exports = inventoryItemOptions;
