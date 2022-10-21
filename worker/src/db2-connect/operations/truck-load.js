const { gql } = require('../../api');

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

const getTime = (dateString, timeInput, hasSeconds) => {
  const parseSeconds = hasSeconds || `${timeInput}`.length > 4;
  const timeString = `${timeInput}`.padStart(parseSeconds ? 6 : 4, '0');
  const dateTimeString = parseSeconds
    ? `${dateString}T${timeString.substring(0, 2)}:${timeString.substring(
        2,
        4,
      )}:${timeString.substring(4, 6)}`
    : `${dateString}T${timeString.substring(0, 2)}:${timeString.substring(
        2,
        4,
      )}:00`;
  const isValid = Date.parse(dateTimeString);
  return isValid ? dateTimeString : null;
};

const getUpdatedTruckLoad = (truckLoad, db2TruckLoad, id) => {
  const shipDateString = `${db2TruckLoad['SHPDTY']}`.padStart(6, '0');
  const shipDate = `20${shipDateString.substring(
    0,
    2,
  )}-${shipDateString.substring(2, 4)}-${shipDateString.substring(4, 6)}`;
  const isValidShipDate = Date.parse(shipDate);
  if (!isValidShipDate) {
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
    timeStarted: getTime(shipDate, db2TruckLoad['TSTRTY']),
    timeCompleted: getTime(shipDate, db2TruckLoad['TCOMPY']),
    timeIn: getTime(shipDate, db2TruckLoad['TIMINY'], true),
    timeOut: getTime(shipDate, db2TruckLoad['TIMOTY'], true),
    timeConfirmed: getTime(shipDate, db2TruckLoad['TCNFRY'], true),
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
  iterationLimit: 1000,
};

module.exports = truckLoadOptions;
