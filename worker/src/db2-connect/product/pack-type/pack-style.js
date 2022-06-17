const { gql } = require('../../../api');

const PACK_STYLE_LIST = gql`
  query PACK_STYLE_LIST {
    packStyles {
      nodes {
        id
        shipperId
        packStyle
        styleDescription
        combineWith
      }
    }
  }
`;

const BULK_UPSERT_PACK_STYLE = gql`
  mutation BULK_UPSERT_PACK_STYLE($input: BulkUpsertPackStyleInput!) {
    bulkUpsertPackStyle(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackStyle = (packStyle, db2PackStyle, id) => ({
  ...packStyle,
  id,
  shipperId: db2PackStyle['SHPR#R'],
  packStyle: db2PackStyle['PACKR'],
  styleDescription: db2PackStyle['DESCRR'],
  combineWith: db2PackStyle['CMBR'],
});

const getPackStyleId = (db2PackStyle, packStyles) => {
  const packStyle = Object.values(packStyles).find(
    (pa) =>
      pa.shipperId === db2PackStyle['SHPR#R'].trimEnd() &&
      pa.packStyle === db2PackStyle['PACKR'].trimEnd(),
  );

  return packStyle?.id || `${db2PackStyle['SHPR#R']}-${db2PackStyle['PACKR']}`;
};

const packStyleOptions = {
  db2Query: 'select * from JVFIL.INVP517R;',
  listQuery: PACK_STYLE_LIST,
  upsertQuery: BULK_UPSERT_PACK_STYLE,
  itemName: 'pack style',
  itemPluralName: 'pack styles',
  itemQueryName: 'packStyles',
  upsertQueryName: 'packStyles',
  getUpdatedItem: getUpdatedPackStyle,
  getId: getPackStyleId,
};

module.exports = packStyleOptions;
