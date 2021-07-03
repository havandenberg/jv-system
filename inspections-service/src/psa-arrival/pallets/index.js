const { groupBy, pluck, values } = require('ramda');
const XLSX = require('xlsx');

const { gql, gqlClient } = require('../../api');
const { onError } = require('../../utils');
const { grapeKeys } = require('./content');

const PSA_GRAPE_PALLET_COUNT = gql`
  query PSA_GRAPE_PALLET_COUNT {
    psaGrapePallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_GRAPE_PALLET = gql`
  mutation BATCH_CREATE_PSA_GRAPE_PALLET(
    $input: BatchCreatePsaGrapePalletInput!
  ) {
    batchCreatePsaGrapePallet(input: $input) {
      clientMutationId
      psaGrapePallets {
        id
      }
    }
  }
`;

const dataFiles = [
  { path: '/2020-2021/Grapes 2020-2021.xlsx', finalRowCount: 6636 },
  // { path: '/2019-2020/Grapes 2019-2020.xlsx', finalRowCount: 9621 },
  // { path: '/2018-2019/Grapes 2018-2019.xlsx', finalRowCount: 9658 },
  // { path: '/2017-2018/Grapes 2017-2018.xlsx', finalRowCount: 11941 },
];

const fetchPsaGrapePallets = () => {
  console.log(`\n\nFetching PSA grape pallets: ${new Date().toString()}\n\n`);

  const file = XLSX.readFile(`/jv-qc-inspections/${dataFiles[0].path}`);
  const sheetData = file.Sheets[file.SheetNames[0]];

  const previousYearsPalletsCount = dataFiles
    .slice(1, dataFiles.length)
    .reduce((acc, file) => acc + file.finalRowCount, 0);

  gqlClient
    .request(PSA_GRAPE_PALLET_COUNT)
    .then(({ psaGrapePallets: { totalCount } }) => {
      const dataArray = values(
        groupBy(
          (palletVal) => palletVal.key.replace(/\D/g, ''),
          Object.keys(sheetData).map((key) => ({
            key,
            value: sheetData[key].v,
          })),
        ),
      );

      const newValues = dataArray.slice(
        1 + totalCount - previousYearsPalletsCount,
        dataArray.length - 1,
      );

      const CHUNK_SIZE = 10;
      const segmentedNewValues = [
        ...Array(Math.ceil(newValues.length / CHUNK_SIZE)),
      ].map((_, idx) =>
        newValues.slice(idx * CHUNK_SIZE, idx * CHUNK_SIZE + CHUNK_SIZE),
      );

      console.log(`New pallets found: ${newValues.length}`);

      const numericKeys = ['quantity', 'overallQuality', 'overallCondition'];

      function numberToLetters(num) {
        let letters = '';
        while (num >= 0) {
          letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters;
          num = Math.floor(num / 26) - 1;
        }
        return letters;
      }

      segmentedNewValues.forEach((values) => {
        const newPallets = values.map((pallet) => {
          const palletObj = {};

          grapeKeys.forEach((key, idx) => {
            const isNumeric = numericKeys.includes(key);
            const rowNumber =
              pallet.length > 0 ? pallet[0].key.replace(/\D/g, '') : 0;
            const palletKey = `${numberToLetters(idx)}${rowNumber}`;
            const palletValue = pallet.find((p) => p.key === palletKey);

            if (palletValue) {
              palletObj[key] = isNumeric
                ? parseFloat(palletValue.value)
                : `${palletValue.value}`;
            }
          });

          return palletObj;
        });

        gqlClient
          .request(BATCH_CREATE_PSA_GRAPE_PALLET, {
            input: {
              newPallets,
            },
          })
          .then(({ batchCreatePsaGrapePallet: { psaGrapePallets } }) => {
            console.log(`Pallets added to database: ${psaGrapePallets.length}`);
          })
          .catch(onError);
      });
    })
    .catch(onError);
};

module.exports = {
  fetchPsaGrapePallets,
};
