const { gql } = require('../../api');

const INVENTORY_ITEM_LIST = gql`
  query INVENTORY_ITEM_LIST {
    inventoryItems(orderBy: ID_ASC) {
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

const getUpdatedInventoryItem = (inventoryItem, db2InventoryItem, id) => ({
  ...inventoryItem,
  id,
  productId: db2InventoryItem['PROD#X'],
  locationId: db2InventoryItem['SRTWHX'],
  vesselCode: db2InventoryItem['BOAT#X'],
  jvLotNumber: db2InventoryItem['JVLOTX'],
  shipperId: db2InventoryItem['CSHPRX'],
  palletsReceived: `${db2InventoryItem['PRCVX']}`,
  palletsCommitted: `${db2InventoryItem['PCOMX']}`,
  palletsOnHand: `${db2InventoryItem['PONHX']}`,
  palletsAvailable: `${db2InventoryItem['PAVLX']}`,
  palletsShipped: `${db2InventoryItem['PSHPX']}`,
  palletsTransferredIn: `${db2InventoryItem['PXFRIX']}`,
  palletsTransferredOut: `${db2InventoryItem['PXFROX']}`,
  plu: !!db2InventoryItem['PLUX'],
  countryId: db2InventoryItem['CNTRYX'],
  specialLotNumber: db2InventoryItem['LOTSPX'],
  coast: db2InventoryItem['REGX'] ? 'WC' : 'EC',
  storageRank: db2InventoryItem['INVWKX'],
  warehouseId: db2InventoryItem['SRTWHX'],
});

const inventoryItemOptions = {
  db2Query: `select * from JVFIL.ORDP730X a union select * from JVPREFIL.ORDP730X b order by PROD#X, BOAT#X, CSHPRX;`,
  listQuery: INVENTORY_ITEM_LIST,
  upsertQuery: BULK_UPSERT_INVENTORY_ITEM,
  itemName: 'inventory item',
  itemPluralName: 'inventory items',
  itemQueryName: 'inventoryItems',
  upsertQueryName: 'inventoryItems',
  getUpdatedItem: getUpdatedInventoryItem,
  useIndexAsId: true,
  chunkSize: 200,
};

module.exports = inventoryItemOptions;
