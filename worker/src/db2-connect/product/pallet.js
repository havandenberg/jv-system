const { gql } = require('../../api');

const PALLET_LIST = gql`
  query PALLET_LIST {
    pallets(orderBy: ID_ASC) {
      nodes {
        id
        vesselCode
        palletId
        productId
        currentBoxQuantity
        receivedBoxQuantity
        returnedBoxQuantity
        locationId
        room
        section
        row
        jvLotNumber
        shipperId
        dateTransferredToStorage
        orderId
        backOrderId
        shipped
        age
        volumeDiscountCode
        originalLocationId
        filler
        growerId
        oldPackCode
        packDate
        hatch
        deck
        billOfLading
        containerId
        temperatureRecording
      }
    }
  }
`;

const BULK_UPSERT_PALLET = gql`
  mutation BULK_UPSERT_PALLET($input: BulkUpsertPalletInput!) {
    bulkUpsertPallet(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPallet = (pallet, db2Pallet, id) => ({
  ...pallet,
  id,
  vesselCode: db2Pallet['BOAT#V'],
  palletId: db2Pallet['PID#V'],
  productId: db2Pallet['PROD#V'],
  currentBoxQuantity: `${db2Pallet['PBOXQV']}`,
  receivedBoxQuantity: `${db2Pallet['RBOXQV']}`,
  returnedBoxQuantity: `${db2Pallet['QTYRTV']}`,
  locationId: db2Pallet['PLOC#V'],
  room: db2Pallet['ROOMV'],
  section: db2Pallet['SECTV'],
  row: db2Pallet['ROWV'],
  jvLotNumber: db2Pallet['JVLOTV'],
  shipperId: db2Pallet['SHPR#V'],
  dateTransferredToStorage: `${db2Pallet['TRNCSV']}`,
  orderId: `${db2Pallet['ORD#V']}`,
  backOrderId: `${db2Pallet['BONBRV']}`,
  shipped: db2Pallet['SHPFGV'] === 'TRUE',
  age: `${db2Pallet['AGEDV']}`,
  volumeDiscountCode: `${db2Pallet['VOLDCV']}`,
  originalLocationId: db2Pallet['ORGLCV'],
  filler: db2Pallet['FILLER'],
  growerId: db2Pallet['GROWID'],
  oldPackCode: db2Pallet['PACKG'],
  packDate: `${db2Pallet['PACKDT']}`,
  hatch: db2Pallet['HATCH'],
  deck: db2Pallet['DECKS'],
  billOfLading: db2Pallet['PLBOL'],
  containerId: db2Pallet['CONTR'],
  temperatureRecording: db2Pallet['TEMP#J'],
});

const palletOptions = {
  db2Query: `select * from JVFIL.ORDP710V master left join JVFIL.ORDP710J secondary on master.PID#V = secondary.PALID;`,
  listQuery: PALLET_LIST,
  upsertQuery: BULK_UPSERT_PALLET,
  itemName: 'pallet',
  itemPluralName: 'pallets',
  itemQueryName: 'pallets',
  upsertQueryName: 'pallets',
  getUpdatedItem: getUpdatedPallet,
  useIndexAsId: true,
  chunkSize: 100,
};

const PALLET_SECTION_LIST = gql`
  query PALLET_SECTION_LIST {
    palletSections(orderBy: ID_ASC) {
      nodes {
        id
        palletId
        growerId
        varietyId
        sizeId
        boxQuantity
        packDate
      }
    }
  }
`;

const BULK_UPSERT_PALLET_SECTION = gql`
  mutation BULK_UPSERT_PALLET_SECTION($input: BulkUpsertPalletSectionInput!) {
    bulkUpsertPalletSection(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPalletSection = (palletSection, db2Section, id) => ({
  ...palletSection,
  id,
  palletId: db2Section['PALID'],
  growerId: db2Section['GROWID'],
  varietyId: db2Section['PRODNO'],
  sizeId: db2Section['SIZE'],
  boxQuantity: `${db2Section['QNTYP']}`,
  packDate: `${db2Section['PACKDT']}`,
});

const palletSectionOptions = {
  db2Query: `select * from JVFIL.ORDP7102;`,
  listQuery: PALLET_SECTION_LIST,
  upsertQuery: BULK_UPSERT_PALLET_SECTION,
  itemName: 'pallet section',
  itemPluralName: 'pallet sections',
  itemQueryName: 'palletSections',
  upsertQueryName: 'palletSections',
  getUpdatedItem: getUpdatedPalletSection,
  useIndexAsId: true,
  chunkSize: 50,
};

module.exports = {
  palletOptions,
  palletSectionOptions,
};
