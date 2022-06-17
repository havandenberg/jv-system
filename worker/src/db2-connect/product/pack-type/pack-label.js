const { gql } = require('../../../api');

const PACK_LABEL_LIST = gql`
  query PACK_LABEL_LIST {
    packLabels {
      nodes {
        id
        shipperId
        shipperName
        labelCode
        labelName
      }
    }
  }
`;

const BULK_UPSERT_PACK_LABEL = gql`
  mutation BULK_UPSERT_PACK_LABEL($input: BulkUpsertPackLabelInput!) {
    bulkUpsertPackLabel(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackLabel = (packLabel, db2PackLabel, id) => ({
  ...packLabel,
  id,
  shipperId: db2PackLabel['SHPR#N'],
  shipperName: db2PackLabel['SNAMEN'],
  labelCode: db2PackLabel['LABELN'],
  labelName: db2PackLabel['LNAMEN'],
});

const getPackLabelId = (db2PackLabel, packLabels) => {
  const packLabel = Object.values(packLabels).find(
    (pa) =>
      pa.shipperId === db2PackLabel['SHPR#N'].trimEnd() &&
      pa.labelCode === db2PackLabel['LABELN'].trimEnd(),
  );

  return packLabel?.id || `${db2PackLabel['SHPR#N']}-${db2PackLabel['LABELN']}`;
};

const packLabelOptions = {
  db2Query: 'select * from JVFIL.INVP513N;',
  listQuery: PACK_LABEL_LIST,
  upsertQuery: BULK_UPSERT_PACK_LABEL,
  itemName: 'pack label',
  itemPluralName: 'pack labels',
  itemQueryName: 'packLabels',
  upsertQueryName: 'packLabels',
  getUpdatedItem: getUpdatedPackLabel,
  getId: getPackLabelId,
};

module.exports = packLabelOptions;
