const { gql } = require('../../../api');

const PACK_BOX_STYLE_LIST = gql`
  query PACK_BOX_STYLE_LIST {
    packBoxStyles {
      nodes {
        id
        shipperId
        boxStyle
        boxDescription
        combineWith
        combineDescription
      }
    }
  }
`;

const BULK_UPSERT_PACK_BOX_STYLE = gql`
  mutation BULK_UPSERT_PACK_BOX_STYLE($input: BulkUpsertPackBoxStyleInput!) {
    bulkUpsertPackBoxStyle(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackBoxStyle = (packBoxStyle, db2PackBoxStyle, id) => ({
  ...packBoxStyle,
  id,
  shipperId: db2PackBoxStyle['SHPR#Q'],
  boxStyle: db2PackBoxStyle['BOXQ'],
  boxDescription: db2PackBoxStyle['BXDSCQ'],
  combineWith: db2PackBoxStyle['CMBQ'],
  combineDescription: db2PackBoxStyle['CMDSCQ'],
});

const getPackBoxStyleId = (db2PackBoxStyle, packBoxStyles) => {
  const packBoxStyle = Object.values(packBoxStyles).find(
    (pa) =>
      pa.shipperId === db2PackBoxStyle['SHPR#Q'].trimEnd() &&
      pa.boxStyle === db2PackBoxStyle['BOXQ'].trimEnd(),
  );

  return (
    packBoxStyle?.id ||
    `${db2PackBoxStyle['SHPR#Q']}-${db2PackBoxStyle['BOXQ']}`
  );
};

const packBoxStyleOptions = {
  db2Query: 'select * from JVFIL.INVP516Q;',
  listQuery: PACK_BOX_STYLE_LIST,
  upsertQuery: BULK_UPSERT_PACK_BOX_STYLE,
  itemName: 'pack box style',
  itemPluralName: 'pack box styles',
  itemQueryName: 'packBoxStyles',
  upsertQueryName: 'packBoxStyles',
  getUpdatedItem: getUpdatedPackBoxStyle,
  getId: getPackBoxStyleId,
};

module.exports = packBoxStyleOptions;
