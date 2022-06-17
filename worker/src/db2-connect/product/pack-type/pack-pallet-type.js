const { gql } = require('../../../api');

const PACK_PALLET_TYPE_LIST = gql`
  query PACK_PALLET_TYPE_LIST {
    packPalletTypes {
      nodes {
        id
        shipperId
        palletType
        palletTypeDescription
        combineWith
      }
    }
  }
`;

const BULK_UPSERT_PACK_PALLET_TYPE = gql`
  mutation BULK_UPSERT_PACK_PALLET_TYPE(
    $input: BulkUpsertPackPalletTypeInput!
  ) {
    bulkUpsertPackPalletType(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackPalletType = (packPalletType, db2PackPalletType, id) => ({
  ...packPalletType,
  id,
  shipperId: db2PackPalletType['SHPR#Y'],
  palletType: db2PackPalletType['PIDY'],
  palletTypeDescription: db2PackPalletType['DESCTY'],
  combineWith: db2PackPalletType['CMBY'],
});

const getPackPalletTypeId = (db2PackPalletType, packPalletTypes) => {
  const packPalletType = Object.values(packPalletTypes).find(
    (pa) =>
      pa.shipperId === db2PackPalletType['SHPR#Y'].trimEnd() &&
      pa.palletType === db2PackPalletType['PIDY'].trimEnd(),
  );

  return (
    packPalletType?.id ||
    `${db2PackPalletType['SHPR#Y']}-${db2PackPalletType['PIDY']}`
  );
};

const packPalletTypeOptions = {
  db2Query: 'select * from JVFIL.INVP524Y;',
  listQuery: PACK_PALLET_TYPE_LIST,
  upsertQuery: BULK_UPSERT_PACK_PALLET_TYPE,
  itemName: 'pack palletType',
  itemPluralName: 'pack palletTypes',
  itemQueryName: 'packPalletTypes',
  upsertQueryName: 'packPalletTypes',
  getUpdatedItem: getUpdatedPackPalletType,
  getId: getPackPalletTypeId,
};

module.exports = packPalletTypeOptions;
