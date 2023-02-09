const { gql } = require('../../../api');
const { getDate } = require('../../utils');

const REPACK_HEADER_LIST = gql`
  query REPACK_HEADER_LIST {
    repackHeaders {
      nodes {
        id
        repackCode
        runNumber
        whBagsOut
        whWeightIn
        whWeightOut
        whBoxesIn
        whBoxesOut
        repackDate
        repackStyleId
        warehouseId
        entryUserCode
        notes
      }
    }
  }
`;

const BULK_UPSERT_REPACK_HEADER = gql`
  mutation BULK_UPSERT_REPACK_HEADER($input: BulkUpsertRepackHeaderInput!) {
    bulkUpsertRepackHeader(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_REPACK_HEADER = gql`
  mutation BULK_DELETE_REPACK_HEADER($input: BulkDeleteRepackHeaderInput!) {
    bulkDeleteRepackHeader(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedRepackHeader = (repackHeader, db2RepackHeader, id) => ({
  ...repackHeader,
  id,
  repackCode: db2RepackHeader['ORD#H'],
  runNumber: db2RepackHeader['RUN#'],
  whBagsOut: `${db2RepackHeader['BAGSH']}`,
  whWeightIn: `${db2RepackHeader['WTIN']}`,
  whWeightOut: `${db2RepackHeader['WTOUT']}`,
  whBoxesIn: `${db2RepackHeader['BOXIN']}`,
  whBoxesOut: `${db2RepackHeader['BOXOUT']}`,
  repackDate:
    db2RepackHeader['ORDDATE'].length < 4
      ? getDate(
          '22',
          '0' + `${db2RepackHeader['ORDDATE']}`.slice(0, 1),
          `${db2RepackHeader['ORDDATE']}`.slice(1, 3),
        )
      : getDate(
          `${db2RepackHeader['ORDDATE']}`.slice(4, 6),
          `${db2RepackHeader['ORDDATE']}`.slice(2, 4),
          `${db2RepackHeader['ORDDATE']}`.slice(0, 2),
        ),
  repackStyleId: db2RepackHeader['PACKH'],
  warehouseId: db2RepackHeader['TLOCH'],
  entryUserCode: db2RepackHeader['USERH'],
  notes: db2RepackHeader['COMM#H'],
});

const getRepackHeaderId = (db2RepackHeader, repackHeaders) => {
  const repackHeader = Object.values(repackHeaders).find(
    (it) =>
      it.repackCode === `${db2RepackHeader['ORD#H']}`.trimEnd() &&
      it.runNumber === `${db2RepackHeader['RUN#']}`.trimEnd(),
  );

  return (
    repackHeader?.id ||
    `${db2RepackHeader['ORD#H'].trimEnd()}-${db2RepackHeader['RUN#'].trimEnd()}`
  );
};

const repackHeaderOptions = {
  db2Query: `select * from JVFIL.TEMP100H;`,
  listQuery: REPACK_HEADER_LIST,
  deleteQuery: BULK_DELETE_REPACK_HEADER,
  upsertQuery: BULK_UPSERT_REPACK_HEADER,
  itemName: 'repack header',
  itemPluralName: 'repack headers',
  itemQueryName: 'repackHeaders',
  upsertQueryName: 'repackHeaders',
  getUpdatedItem: getUpdatedRepackHeader,
  getId: getRepackHeaderId,
  iterationLimit: 10000,
};

module.exports = repackHeaderOptions;
