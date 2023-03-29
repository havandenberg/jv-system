const { gql } = require('../../api');
const { onError } = require('../../utils');

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
        isPre
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
  locationId:
    db2InventoryItem['PLOC#X'].trimEnd() ||
    db2InventoryItem['SRTWHX'].trimEnd(),
  vesselCode: db2InventoryItem['BOAT#X'],
  jvLotNumber: db2InventoryItem['JVLOTX'],
  shipperId:
    db2InventoryItem['SHPR#X'].trimEnd() ||
    db2InventoryItem['CSHPRX'].trimEnd(),
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
  isPre: db2InventoryItem.isPre,
});

const getInventoryItemId = (db2InventoryItem, inventoryItems) => {
  const inventoryItem = Object.values(inventoryItems).find(
    (it) =>
      it.productId === db2InventoryItem['PROD#X'].trimEnd() &&
      it.locationId ===
        (db2InventoryItem['PLOC#X'].trimEnd() ||
          db2InventoryItem['SRTWHX'].trimEnd()) &&
      it.vesselCode === db2InventoryItem['BOAT#X'].trimEnd() &&
      it.jvLotNumber === db2InventoryItem['JVLOTX'].trimEnd() &&
      it.shipperId ===
        (db2InventoryItem['SHPR#X'].trimEnd() ||
          db2InventoryItem['CSHPRX'].trimEnd()) &&
      it.isPre === db2InventoryItem.isPre,
  );

  return (
    inventoryItem?.id ||
    `${db2InventoryItem['PROD#X'].trimEnd()}-${
      db2InventoryItem['PLOC#X'].trimEnd() ||
      db2InventoryItem['SRTWHX'].trimEnd()
    }-${db2InventoryItem['BOAT#X'].trimEnd()}-${db2InventoryItem[
      'JVLOTX'
    ].trimEnd()}-${
      db2InventoryItem['SHPR#X'].trimEnd() ||
      db2InventoryItem['CSHPRX'].trimEnd()
    }-${db2InventoryItem.isPre}`
  );
};

const inventoryItemOptions = {
  getDB2Items: async (db) => {
    const realItems = await db
      .query('select * from JVFIL.ORDP730X;')
      .catch(onError);
    const preItems = await db
      .query('select * from JVPREFIL.ORDP730X;')
      .catch(onError);
    const items = [
      ...realItems.map((v) => ({ ...v, isPre: false })),
      ,
      ...preItems.map((v) => ({ ...v, isPre: true })),
    ];
    return items;
  },
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
  iterationLimit: 40000,
};

module.exports = inventoryItemOptions;
