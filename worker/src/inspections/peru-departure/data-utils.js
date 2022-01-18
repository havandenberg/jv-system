const path = require('path');
const { mapObjIndexed, pathOr } = require('ramda');
const XLSX = require('xlsx');

const ewsArgs = {
  FindFolder: {
    attributes: {
      Traversal: 'Deep',
    },
    FolderShape: {
      BaseShape: 'Default',
    },
    ParentFolderIds: {
      DistinguishedFolderId: {
        attributes: {
          Id: 'inbox',
        },
      },
    },
  },
  FindItem: {
    attributes: {
      Traversal: 'Shallow',
    },
    ItemShape: {
      't:BaseShape': 'IdOnly',
      't:AdditionalProperties': {
        't:FieldURI': {
          attributes: {
            FieldURI: 'item:Subject',
          },
        },
      },
    },
    ParentFolderIds: {
      DistinguishedFolderId: {
        attributes: {
          Id: 'inbox',
        },
      },
    },
  },
  GetAttachment: (Id) => ({
    ItemShape: {
      AttachmentShape: {},
    },
    AttachmentIds: {
      't:AttachmentId': {
        attributes: {
          Id,
        },
      },
    },
  }),
  GetItem: (Id, ChangeKey) => ({
    ItemShape: {
      BaseShape: 'Default',
      't:AdditionalProperties': {
        't:FieldURI': {
          attributes: {
            FieldURI: 'item:Attachments',
          },
        },
      },
    },
    ItemIds: {
      ItemId: {
        attributes: {
          Id,
          ChangeKey,
        },
      },
    },
  }),
  MoveItem: (FolderId, ItemId, ChangeKey) => ({
    ToFolderId: {
      't:FolderId': {
        attributes: {
          Id: FolderId,
        },
      },
    },
    ItemIds: {
      't:ItemId': {
        attributes: {
          Id: ItemId,
          ChangeKey,
        },
      },
    },
  }),
  UpdateItem: (ItemId, ChangeKey) => ({
    attributes: {
      ConflictResolution: 'AutoResolve',
      MessageDisposition: 'SaveOnly',
    },
    ItemChanges: {
      't:ItemChange': {
        't:ItemId': {
          attributes: {
            Id: ItemId,
            ChangeKey,
          },
        },
        't:Updates': {
          't:SetItemField': {
            FieldURI: {
              attributes: {
                FieldURI: 'message:IsRead',
              },
            },
            't:Message': {
              't:IsRead': 'true',
            },
          },
        },
      },
    },
  }),
};

const parseData = ({ Name, Content }) => {
  if (path.extname(Name).toLowerCase() === '.xlsx') {
    let workbook = XLSX.read(Content, {
      sheetRows: 100,
      type: 'base64',
    });

    if (workbook.SheetNames.length === 3 && workbook.SheetNames[2] === 'QC') {
      const sheetData = workbook.Sheets[workbook.SheetNames[2]];
      var stream = XLSX.utils.sheet_to_csv(sheetData, {
        blankrows: false,
        skipHidden: true,
        strip: true,
      });

      const dataArray = stream
        .split('\n')
        .filter((row) => row.length > 0)
        .map((row) =>
          row
            .split(',')
            .map((cell) => cell.trim())
            .filter((val) => val),
        );

      let lastPalletIndex = -1;
      dataArray.forEach((val, index) => {
        if (val[0] === 'QC Comments:') {
          lastPalletIndex = index;
        }
      });

      return {
        avgBunchesPerBox: parseFloat(pathOr('', [-3, 3], dataArray)),
        avgNetWeight: parseFloat(pathOr('', [-3, 2], dataArray)),
        bagsPerBox: parseFloat(pathOr('', [4, 5], dataArray)),
        bagType: '',
        brand: pathOr('', [2, 3], dataArray),
        brixMax: parseFloat(pathOr('', [-3, 5], dataArray)),
        brixAvg: parseFloat(pathOr('', [-2, 1], dataArray)),
        brixMin: parseFloat(pathOr('', [-1, 1], dataArray)),
        category: pathOr('', [3, 3], dataArray),
        comments: pathOr('', [lastPalletIndex, 1], dataArray),
        conditionScore: parseFloat(pathOr('', [-3, 1], dataArray)),
        containerId: pathOr('', [5, 1], dataArray),
        destination: pathOr('', [3, 1], dataArray),
        departureWeek: pathOr('', [4, 2], dataArray),
        exporter: pathOr('', [1, 1], dataArray),
        inspectionDate: new Date(
          pathOr('', [5, -1], dataArray),
        ).toLocaleDateString(),
        packingDate: new Date(
          pathOr('', [4, 1], dataArray),
        ).toLocaleDateString(),
        packingHouse: pathOr('', [2, 1], dataArray),
        packingMaterial: pathOr('', [4, 4], dataArray),
        presentation: pathOr('', [3, 4], dataArray),
        qualityScore: parseFloat(pathOr('', [-3, 0], dataArray)),
        variety: pathOr('', [1, 3], dataArray),
        peruDepartureInspectionPalletsUsingContainerId: {
          create: dataArray.slice(7, lastPalletIndex).map((val) =>
            mapObjIndexed((v, key) => {
              const isAverage = val[0].toLowerCase() === 'average';
              if (isAverage && key === 'size') {
                return '';
              }
              const modifyIndex =
                isAverage && !['palletId', 'size'].includes(key);
              const index =
                Object.keys(emptyPallet).indexOf(key) + (modifyIndex ? -1 : 0);
              return index > (modifyIndex ? 0 : 1)
                ? parseFloat(val[index])
                : val[index];
            }, emptyPallet),
          ),
        },
      };
    }
  }
};

const emptyPallet = {
  palletId: '',
  size: '',
  netWeight: 0,
  openingScore: 0,
  colorScore: 0,
  stemScore: 0,
  textureScore: 0,
  bunchesPerBox: 0,
  brix: 0,
  qualityScore: 0,
  conditionScore: 0,
  stragglyTightPct: 0,
  surfaceDiscPct: 0,
  russetScarsPct: 0,
  sunburnPct: 0,
  undersizedBunchesPct: 0,
  otherDefectsPct: 0,
  totalQualityDefectsPct: 0,
  stemDehyPct: 0,
  glassyWeakPct: 0,
  decayPct: 0,
  splitCrushedPct: 0,
  drySplitPct: 0,
  wetStickyPct: 0,
  waterberriesPct: 0,
  shatterPct: 0,
  totalConditionDefectsPct: 0,
  totalDefectsPct: 0,
};

module.exports = {
  emptyPallet,
  ewsArgs,
  parseData,
};
