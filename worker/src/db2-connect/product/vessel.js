const { gql } = require('../../api');
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

const vesselOptions = {
  db2Query:
    'select * from JVFIL.ORDP750Z union select * from JVPREFIL.ORDP750Z order by BOAT#Z;',
  listQuery: VESSEL_LIST,
  upsertQuery: BULK_UPSERT_VESSEL,
  itemName: 'vessel',
  itemPluralName: 'vessels',
  itemQueryName: 'vessels',
  upsertQueryName: 'vessels',
  getUpdatedItem: getUpdatedVessel,
  useIndexAsId: true,
  chunkSize: 200,
};

module.exports = vesselOptions;
