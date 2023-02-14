const { sortBy } = require('ramda');
const { gql } = require('../../api');
const { onError } = require('../../utils');
const { getDate } = require('../utils');

const VESSEL_LIST = gql`
  query VESSEL_LIST {
    vessels(orderBy: ID_ASC) {
      nodes {
        id
        vesselCode
        preVesselCode
        vesselName
        arrivalPort
        countryId
        departureDate
        arrivalDate
        dischargeDate
        coast
        isPre
        invFlag
      }
    }
  }
`;

const BULK_UPSERT_VESSEL = gql`
  mutation BULK_UPSERT_VESSEL($input: BulkUpsertVesselInput!) {
    bulkUpsertVessel(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_VESSEL = gql`
  mutation BULK_DELETE_VESSEL($input: BulkDeleteVesselInput!) {
    bulkDeleteVessel(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedVessel = (vessel, db2Vessel, id) => ({
  ...vessel,
  id,
  vesselCode: db2Vessel['BOAT#Z'],
  preVesselCode: !db2Vessel['CNTRYZ']
    ? db2Vessel['BOAT#Z']
    : vessel.preVesselCode || '',
  vesselName: db2Vessel['BNAMEZ'],
  arrivalPort: db2Vessel['ARVPTZ'],
  countryId: db2Vessel['CNTRYZ'],
  departureDate: getDate(
    db2Vessel['DEPDDZ'],
    db2Vessel['DEPMMZ'],
    db2Vessel['DEPYYZ'],
  ),
  arrivalDate: getDate(
    db2Vessel['ARVDDZ'],
    db2Vessel['ARVMMZ'],
    db2Vessel['ARVYYZ'],
  ),
  dischargeDate: getDate(
    db2Vessel['DISDDZ'],
    db2Vessel['DISMMZ'],
    db2Vessel['DISYYZ'],
  ),
  coast: db2Vessel['PAYTYZ'] ? 'WC' : 'EC',
  isPre: !db2Vessel['CNTRYZ'],
  invFlag: !!db2Vessel['INVFGZ'],
});

const getVesselId = (db2Vessel, vessels) => {
  const vessel = Object.values(vessels).find(
    (it) => it.vesselCode === db2Vessel['BOAT#Z'].trimEnd(),
  );

  return vessel?.vesselCode || `${db2Vessel['BOAT#Z'].trimEnd()}`;
};

const vesselOptions = {
  getDB2Items: async (db) => {
    const realVessels = await db
      .query('select * from JVFIL.ORDP750Z;')
      .catch(onError);
    const preVessels = await db
      .query('select * from JVPREFIL.ORDP750Z;')
      .catch(onError);
    const vessels = sortBy(
      (v) => v['BOAT#Z'],
      [
        ...realVessels.filter((v) => {
          const vesselCode = parseInt(v['BOAT#Z'], 10);
          return isNaN(vesselCode) || vesselCode < 700 || vesselCode > 899;
        }),
        ...preVessels,
      ],
    );
    return vessels;
  },
  listQuery: VESSEL_LIST,
  deleteQuery: BULK_DELETE_VESSEL,
  upsertQuery: BULK_UPSERT_VESSEL,
  itemName: 'vessel',
  itemPluralName: 'vessels',
  itemQueryName: 'vessels',
  upsertQueryName: 'vessels',
  getUpdatedItem: getUpdatedVessel,
  getId: getVesselId,
  chunkSize: 200,
  iterationLimit: 2000,
};

module.exports = vesselOptions;
