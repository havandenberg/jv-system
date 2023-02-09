const { gql } = require('../../api');
const { getDateTime } = require('../utils');

const TRUCK_LOAD_LIST = gql`
  query TRUCK_LOAD_LIST {
    truckLoads {
      nodes {
        id
        loadId
        loadStatus
        vendorId
        fob
        shipDate
        ryanNumber
        truckerName
        expeditorName
        timeStarted
        timeCompleted
        timeIn
        timeOut
        timeConfirmed
        warehouseId
        changeFlag
        licensePlate
        inUse
        cartage
        cartageVendorId
        temperature
        loadLock
        notes
      }
    }
  }
`;

const BULK_UPSERT_TRUCK_LOAD = gql`
  mutation BULK_UPSERT_TRUCK_LOAD($input: BulkUpsertTruckLoadInput!) {
    bulkUpsertTruckLoad(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_TRUCK_LOAD = gql`
  mutation BULK_DELETE_TRUCK_LOAD($input: BulkDeleteTruckLoadInput!) {
    bulkDeleteTruckLoad(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedTruckLoad = (truckLoad, db2TruckLoad, id) => {
  const shipDate = getDateTime(db2TruckLoad['SHPDTY']);
  if (!shipDate) {
    return null;
  }
  return {
    ...truckLoad,
    id,
    loadId: `${db2TruckLoad['LOAD#Y'].trimEnd()}`,
    loadStatus: db2TruckLoad['STATY'],
    vendorId: `${db2TruckLoad['TRKIDY'].trimEnd()}`,
    fob: db2TruckLoad['FOBY'] === 'F',
    shipDate,
    ryanNumber: db2TruckLoad['RYAN#Y'],
    truckerName: db2TruckLoad['TRKNMY'],
    expeditorName: db2TruckLoad['EXPEDY'],
    timeStarted: getDateTime(db2TruckLoad['SHPDTY'], db2TruckLoad['TSTRTY']),
    timeCompleted: getDateTime(db2TruckLoad['SHPDTY'], db2TruckLoad['TCOMPY']),
    timeIn: getDateTime(db2TruckLoad['SHPDTY'], db2TruckLoad['TIMINY'], true),
    timeOut: getDateTime(db2TruckLoad['SHPDTY'], db2TruckLoad['TIMOTY'], true),
    timeConfirmed: getDateTime(
      db2TruckLoad['SHPDTY'],
      db2TruckLoad['TCNFRY'],
      true,
    ),
    warehouseId: `${db2TruckLoad['LOCNY'].trimEnd()}`,
    changeFlag: !!db2TruckLoad['CFLAGY'],
    licensePlate: db2TruckLoad['TLIC#Y'],
    inUse: !!db2TruckLoad['INUSY'],
    cartage: db2TruckLoad['CRTIDY'],
    cartageVendorId: `${db2TruckLoad['CRGTY']}`,
    temperature: db2TruckLoad['TEMPY'],
    loadLock: db2TruckLoad['LDLCKY'],
    notes: db2TruckLoad['SPIN1Y'],
  };
};

const getTruckLoadId = (db2TruckLoad, truckLoads) => {
  const truckLoad = Object.values(truckLoads).find(
    (it) =>
      it.loadId === `${db2TruckLoad['LOAD#Y'].trimEnd()}` &&
      it.vendorId === `${db2TruckLoad['TRKIDY'].trimEnd()}` &&
      it.warehouseId === `${db2TruckLoad['LOCNY'].trimEnd()}`,
  );

  return (
    truckLoad?.id ||
    `${db2TruckLoad['LOAD#Y'].trimEnd()}-${db2TruckLoad[
      'TRKIDY'
    ].trimEnd()}-${db2TruckLoad['LOCNY'].trimEnd()}`
  );
};

const truckLoadOptions = {
  db2Query: `select * from JVFIL.ORDP740Y;`,
  listQuery: TRUCK_LOAD_LIST,
  deleteQuery: BULK_DELETE_TRUCK_LOAD,
  upsertQuery: BULK_UPSERT_TRUCK_LOAD,
  itemName: 'truck load',
  itemPluralName: 'truck loads',
  itemQueryName: 'truckLoads',
  upsertQueryName: 'truckLoads',
  getUpdatedItem: getUpdatedTruckLoad,
  getId: getTruckLoadId,
  chunkSize: 100,
  iterationLimit: 30000,
};

module.exports = truckLoadOptions;
