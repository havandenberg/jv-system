const { gql } = require('../../api');
const { getDate } = require('../utils');

const CHECK_HEADER_LIST = gql`
  query CHECK_HEADER_LIST {
    checkHeaders {
      nodes {
        id
        isReconciled
        checkStatus
        checkNumber
        vendorId
        remitToCode
        invoiceAmount
        discountAmount
        checkAmount
        checkDate
        bankId
        invoiceId
        isVoid
        entryDate
      }
    }
  }
`;

const BULK_UPSERT_CHECK_HEADER = gql`
  mutation BULK_UPSERT_CHECK_HEADER($input: BulkUpsertCheckHeaderInput!) {
    bulkUpsertCheckHeader(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_CHECK_HEADER = gql`
  mutation BULK_DELETE_CHECK_HEADER($input: BulkDeleteCheckHeaderInput!) {
    bulkDeleteCheckHeader(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedCheckHeader = (checkHeader, db2CheckHeader, id) => ({
  ...checkHeader,
  id,
  isReconciled: db2CheckHeader['CHKCDK'] === 'V',
  checkStatus: db2CheckHeader['CHKSTK'],
  checkNumber: `${db2CheckHeader['CHKNOK']}`,
  vendorId: db2CheckHeader['VEND#K'],
  remitToCode: `${db2CheckHeader['REMCDK']}`,
  invoiceAmount: `${db2CheckHeader['INVAMK']}`,
  discountAmount: `${db2CheckHeader['DSCNTK']}`,
  checkAmount: `${db2CheckHeader['CHKAMK']}`,
  checkDate: getDate(
    db2CheckHeader['CHKDDK'],
    db2CheckHeader['CHKMMK'],
    db2CheckHeader['CHKYYK'],
  ),
  bankId: db2CheckHeader['BANK#K'],
  invoiceId: db2CheckHeader['INVNOK'],
  isVoid: db2CheckHeader['VCHKCK'] === '01',
  entryDate: getDate(
    db2CheckHeader['RCDTDK'],
    db2CheckHeader['RCDTMK'],
    db2CheckHeader['RCDTYK'],
  ),
});

const checkHeaderOptions = {
  db2Query: `select * from GDSAPFIL.ACPP600K;`,
  listQuery: CHECK_HEADER_LIST,
  deleteQuery: BULK_DELETE_CHECK_HEADER,
  upsertQuery: BULK_UPSERT_CHECK_HEADER,
  itemName: 'check header',
  itemPluralName: 'check headers',
  itemQueryName: 'checkHeaders',
  upsertQueryName: 'checkHeaders',
  getUpdatedItem: getUpdatedCheckHeader,
  useIndexAsId: true,
  iterationLimit: 5000,
};

module.exports = checkHeaderOptions;
