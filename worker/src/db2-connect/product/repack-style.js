const { gql } = require('../../api');

const REPACK_STYLE_LIST = gql`
  query REPACK_STYLE_LIST {
    repackStyles {
      nodes {
        id
        styleName
        styleDescription
        lqdCode
        filmLength
        packOutWeight
      }
    }
  }
`;

const BULK_UPSERT_REPACK_STYLE = gql`
  mutation BULK_UPSERT_REPACK_STYLE($input: BulkUpsertRepackStyleInput!) {
    bulkUpsertRepackStyle(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_REPACK_STYLE = gql`
  mutation BULK_DELETE_REPACK_STYLE($input: BulkDeleteRepackStyleInput!) {
    bulkDeleteRepackStyle(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedRepackStyle = (repackStyle, db2RepackStyle) => ({
  ...repackStyle,
  id: db2RepackStyle['PACKS'],
  styleName: db2RepackStyle['CTXWTS'],
  styleDescription: db2RepackStyle['DESCS'],
  lqdCode: db2RepackStyle['LIQS'],
  filmLength: `${db2RepackStyle['LENGTHS']}`,
  packOutWeight: `${db2RepackStyle['PKWT']}`,
});

const repackStyleOptions = {
  db2Query: `select * from JVFIL.TEMP200S;`,
  listQuery: REPACK_STYLE_LIST,
  deleteQuery: BULK_DELETE_REPACK_STYLE,
  upsertQuery: BULK_UPSERT_REPACK_STYLE,
  itemName: 'repack style',
  itemPluralName: 'repack styles',
  itemQueryName: 'repackStyles',
  upsertQueryName: 'repackStyles',
  getUpdatedItem: getUpdatedRepackStyle,
  idKey: 'PACKS',
};

module.exports = repackStyleOptions;
