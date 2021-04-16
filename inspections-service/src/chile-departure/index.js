const decompress = require('decompress');
const fetch = require('node-fetch');
const { pluck, uniqBy } = require('ramda');
const XLSX = require('xlsx');

const { gql, gqlClient, DISTINCT_VALUES } = require('../api');

const BATCH_CREATE_CHILE_DEPARTURE_INSPECTION_PALLET = gql`
  mutation BATCH_CREATE_CHILE_DEPARTURE_INSPECTION_PALLET(
    $input: BatchCreateChileDepartureInspectionPalletInput!
  ) {
    batchCreateChileDepartureInspectionPallet(input: $input) {
      clientMutationId
      chileDepartureInspectionPallets {
        imagesLink
        lotNumber
      }
    }
  }
`;

const fetchChileDepartureInspections = () => {
  console.log(
    `\nFetching chile departure inspections: ${new Date().toLocaleString()}`,
  );
  fetch(process.env.CDI_API_URL, {
    method: 'GET',
  })
    .then((response) => response.blob())
    .then(async (res) => {
      const file = XLSX.read(await res.arrayBuffer(), { type: 'array' });
      const isValid =
        file.SheetNames.length === 1 && file.SheetNames[0] === 'Sheet1';
      if (isValid) {
        const sheetData = file.Sheets[file.SheetNames[0]];
        var stream = XLSX.utils.sheet_to_csv(sheetData, {
          blankrows: false,
          skipHidden: true,
          strip: true,
          FS: '|',
        });
        const dataArray = stream
          .split('\n')
          .filter((row) => row.length > 0)
          .map((row) => row.split('|').map((cell) => cell.trim()));
        gqlClient
          .request(DISTINCT_VALUES, {
            columnName: 'id',
            tableName: 'chile_departure_inspection_pallet',
          })
          .then(({ distinctValues: { nodes } }) => {
            const startIndex = 1;
            const endIndex = dataArray
              .reverse()
              .findIndex((row) => nodes.includes(row[57]));
            console.log(
              `New pallets found: ${
                (endIndex > -1 ? endIndex : dataArray.length) - startIndex
              }`,
            );
            const newPallets = dataArray
              .slice(startIndex, endIndex)
              .map((pallet) => ({
                id: pallet[57],
                lotId: pallet[56],
                lotNumber: pallet[0],
                locationName: pallet[1],
                shipper: pallet[4],
                inspectionDate: pallet[6],
                productName: pallet[7],
                packingType: pallet[8],
                productType: pallet[9],
                palletCount: parseFloat(pallet[10]),
                supervisor: pallet[12],
                palletNumber: pallet[15],
                boxesCount: parseFloat(pallet[16]),
                netWeight: parseFloat(pallet[18]),
                grower: pallet[19],
                size: pallet[20],
                variety: pallet[21],
                packingDate: pallet[23],
                label: pallet[25],
                temperature: pallet[26],
                openAppearance: pallet[28],
                color: pallet[29],
                stem: pallet[30],
                texture: pallet[31],
                bunchesCount: parseFloat(pallet[32]) || -1,
                brix: parseFloat(pallet[33]),
                diameterMin: parseFloat(pallet[34]) || -1,
                diameterMax: parseFloat(pallet[35]) || -1,
                stragglyTightPct: parseFloat(pallet[36]),
                surfaceDiscPct: parseFloat(pallet[37]),
                russetScarsPct: parseFloat(pallet[38]),
                sunburnPct: parseFloat(pallet[39]),
                undersizedBunchesPct: parseFloat(pallet[40]),
                otherDefectsPct: parseFloat(pallet[41]),
                stemDehyPct: parseFloat(pallet[42]),
                glassyWeakPct: parseFloat(pallet[43]),
                decayPct: parseFloat(pallet[44]),
                splitCrushedPct: parseFloat(pallet[45]),
                drySplitPct: parseFloat(pallet[46]),
                wetStickyPct: parseFloat(pallet[47]),
                waterberriesPct: parseFloat(pallet[48]),
                shatterPct: parseFloat(pallet[49]),
                totalQualityDefectsPct: parseFloat(pallet[50]),
                totalConditionDefectsPct: parseFloat(pallet[51]),
                qualityScore: parseFloat(pallet[52]),
                conditionScore: parseFloat(pallet[53]),
                scoreName: pallet[55],
                reportLink: pallet[58],
                imagesLink: pallet[59],
              }));
            gqlClient
              .request(BATCH_CREATE_CHILE_DEPARTURE_INSPECTION_PALLET, {
                input: {
                  newPallets,
                },
              })
              .then(
                ({
                  batchCreateChileDepartureInspectionPallet: {
                    chileDepartureInspectionPallets,
                  },
                }) => {
                  const newLots = uniqBy(
                    (pt) => pt.lotNumber,
                    chileDepartureInspectionPallets,
                  );
                  console.log(
                    `Lots added to database: ${JSON.stringify(
                      pluck('lotNumber', newLots),
                    )}`,
                  );
                  newLots.forEach((newLot) => {
                    fetch(newLot.imagesLink)
                      .then((res) => res.buffer())
                      .then((res) => {
                        decompress(
                          res,
                          `/chile-departure-inspections/${newLot.lotNumber}`,
                          {
                            filter: (file) =>
                              !file.path.includes('thum') &&
                              path.extname(file.path) === '.jpg',
                          },
                        ).then((files) => {
                          console.log(
                            `${files.length} images added: ${newLot.lotNumber}`,
                          );
                        });
                      });
                  });
                },
              )
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      }
    })
    .catch((e) => console.log(e));
};

module.exports = {
  fetchChileDepartureInspections,
};
