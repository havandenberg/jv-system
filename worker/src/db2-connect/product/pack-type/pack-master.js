const { gql } = require('../../../api');

const PACK_MASTER_LIST = gql`
  query PACK_MASTER_LIST {
    packMasters {
      nodes {
        id
        shipperId
        labelCodeId
        customerCodeId
        boxTypeId
        boxStyleId
        packStyleId
        outCodeId
        outQuantity
        outWeight
        productionCodeId
        treeRipeId
        gradeCodeId
        maCodeId
        linerCodeId
        netWeightContents
        netWeightBox
        boxLength
        boxWidth
        boxHeight
        palletTypeId
        defaultPalletQuantity
        pluUpcCode
        destinationCodeId
        oldPackCode
        oldLabelCode
        jvPackCode
        packDescription
        varietyId
        speciesId
        holdCodeId
      }
    }
  }
`;

const BULK_UPSERT_PACK_MASTER = gql`
  mutation BULK_UPSERT_PACK_MASTER($input: BulkUpsertPackMasterInput!) {
    bulkUpsertPackMaster(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_PACK_MASTER = gql`
  mutation BULK_DELETE_PACK_MASTER($input: BulkDeletePackMasterInput!) {
    bulkDeletePackMaster(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackMaster = (packMaster, db2PackMaster, id) => ({
  ...packMaster,
  id,
  shipperId: db2PackMaster['SHPR#J'],
  labelCodeId: db2PackMaster['LABELJ'],
  customerCodeId: db2PackMaster['CCODEJ'],
  boxTypeId: db2PackMaster['BOXTJ'],
  boxStyleId: db2PackMaster['BOXSJ'],
  packStyleId: db2PackMaster['PACKSJ'],
  outCodeId: db2PackMaster['PACKOJ'],
  outQuantity: `${db2PackMaster['PACKQJ']}`,
  outWeight: `${db2PackMaster['PACKWJ']}`,
  productionCodeId: db2PackMaster['PCODEJ'],
  treeRipeId: db2PackMaster['TREEJ'],
  gradeCodeId: db2PackMaster['GRADEJ'],
  maCodeId: db2PackMaster['MAWJ'],
  linerCodeId: db2PackMaster['LINERJ'],
  netWeightContents: `${db2PackMaster['NETWTJ']}`,
  netWeightBox: `${db2PackMaster['NETBWJ']}`,
  boxLength: `${db2PackMaster['LENGTHJ']}`,
  boxWidth: `${db2PackMaster['WIDTHJ']}`,
  boxHeight: `${db2PackMaster['HIGHTJ']}`,
  palletTypeId: db2PackMaster['PIDJ'],
  defaultPalletQuantity: `${db2PackMaster['DEFQTYJ']}`,
  pluUpcCode: db2PackMaster['PLUJ'],
  destinationCodeId: db2PackMaster['DESTJ'],
  oldPackCode: db2PackMaster['OLDPKJ'],
  oldLabelCode: db2PackMaster['OLDLBJ'],
  jvPackCode: db2PackMaster['JVPAKJ'],
  packDescription: db2PackMaster['DESC2D'],
  varietyId: db2PackMaster['P4J'],
  speciesId: db2PackMaster['SPEJ'],
  holdCodeId: db2PackMaster['HOLDJ'],
});

const packMasterOptions = {
  db2Query: 'select * from JVFIL.INVP509J;',
  listQuery: PACK_MASTER_LIST,
  deleteQuery: BULK_DELETE_PACK_MASTER,
  upsertQuery: BULK_UPSERT_PACK_MASTER,
  itemName: 'pack master',
  itemPluralName: 'pack masters',
  itemQueryName: 'packMasters',
  upsertQueryName: 'packMasters',
  getUpdatedItem: getUpdatedPackMaster,
  useIndexAsId: true,
  iterationLimit: 2000,
  chunkSize: 50,
};

module.exports = packMasterOptions;
