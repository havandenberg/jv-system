const { groupBy, values } = require('ramda');
const XLSX = require('xlsx');

const { gql, gqlClient } = require('../../../api');
const { onError } = require('../../../utils');
const {
  grapeKeys,
  citrusKeys,
  stoneFruitKeys,
  pomegranateKeys,
  persimmonKeys,
  pearKeys,
  lemonKeys,
  cherryKeys,
  appleKeys,
} = require('./content');

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

const PSA_CITRUS_PALLET_COUNT = gql`
  query PSA_CITRUS_PALLET_COUNT {
    psaCitrusPallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_CITRUS_PALLET = gql`
  mutation BATCH_CREATE_PSA_CITRUS_PALLET(
    $input: BatchCreatePsaCitrusPalletInput!
  ) {
    batchCreatePsaCitrusPallet(input: $input) {
      clientMutationId
      psaCitrusPallets {
        id
      }
    }
  }
`;

const PSA_STONE_FRUIT_PALLET_COUNT = gql`
  query PSA_STONE_FRUIT_PALLET_COUNT {
    psaStoneFruitPallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_STONE_FRUIT_PALLET = gql`
  mutation BATCH_CREATE_PSA_STONE_FRUIT_PALLET(
    $input: BatchCreatePsaStoneFruitPalletInput!
  ) {
    batchCreatePsaStoneFruitPallet(input: $input) {
      clientMutationId
      psaStoneFruitPallets {
        id
      }
    }
  }
`;

const PSA_POMEGRANATE_PALLET_COUNT = gql`
  query PSA_POMEGRANATE_PALLET_COUNT {
    psaPomegranatePallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_POMEGRANATE_PALLET = gql`
  mutation BATCH_CREATE_PSA_POMEGRANATE_PALLET(
    $input: BatchCreatePsaPomegranatePalletInput!
  ) {
    batchCreatePsaPomegranatePallet(input: $input) {
      clientMutationId
      psaPomegranatePallets {
        id
      }
    }
  }
`;

const PSA_PERSIMMON_PALLET_COUNT = gql`
  query PSA_PERSIMMON_PALLET_COUNT {
    psaPersimmonPallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_PERSIMMON_PALLET = gql`
  mutation BATCH_CREATE_PSA_PERSIMMON_PALLET(
    $input: BatchCreatePsaPersimmonPalletInput!
  ) {
    batchCreatePsaPersimmonPallet(input: $input) {
      clientMutationId
      psaPersimmonPallets {
        id
      }
    }
  }
`;

const PSA_PEAR_PALLET_COUNT = gql`
  query PSA_PEAR_PALLET_COUNT {
    psaPearPallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_PEAR_PALLET = gql`
  mutation BATCH_CREATE_PSA_PEAR_PALLET(
    $input: BatchCreatePsaPearPalletInput!
  ) {
    batchCreatePsaPearPallet(input: $input) {
      clientMutationId
      psaPearPallets {
        id
      }
    }
  }
`;

const PSA_LEMON_PALLET_COUNT = gql`
  query PSA_LEMON_PALLET_COUNT {
    psaLemonPallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_LEMON_PALLET = gql`
  mutation BATCH_CREATE_PSA_LEMON_PALLET(
    $input: BatchCreatePsaLemonPalletInput!
  ) {
    batchCreatePsaLemonPallet(input: $input) {
      clientMutationId
      psaLemonPallets {
        id
      }
    }
  }
`;

const PSA_CHERRY_PALLET_COUNT = gql`
  query PSA_CHERRY_PALLET_COUNT {
    psaCherryPallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_CHERRY_PALLET = gql`
  mutation BATCH_CREATE_PSA_CHERRY_PALLET(
    $input: BatchCreatePsaCherryPalletInput!
  ) {
    batchCreatePsaCherryPallet(input: $input) {
      clientMutationId
      psaCherryPallets {
        id
      }
    }
  }
`;

const PSA_APPLE_PALLET_COUNT = gql`
  query PSA_APPLE_PALLET_COUNT {
    psaApplePallets {
      totalCount
    }
  }
`;

const BATCH_CREATE_PSA_APPLE_PALLET = gql`
  mutation BATCH_CREATE_PSA_APPLE_PALLET(
    $input: BatchCreatePsaApplePalletInput!
  ) {
    batchCreatePsaApplePallet(input: $input) {
      clientMutationId
      psaApplePallets {
        id
      }
    }
  }
`;

const grapeDataFiles = [
  { path: '2020-2021/Grapes 2020-2021.xlsx', finalRowCount: 6636 },
  // { path: '2019-2020/Grapes 2019-2020.xlsx', finalRowCount: 9621 },
  // { path: '2018-2019/Grapes 2018-2019.xlsx', finalRowCount: 9658 },
  // { path: '2017-2018/Grapes 2017-2018.xlsx', finalRowCount: 11941 },
];

const citrusDataFiles = [
  { path: 'Citrus 2020-2021.xlsx', finalRowCount: 1432 },
  // { path: '2019-2020/Citrus 2019-2020.xlsx', finalRowCount: 0 },
  // { path: '2018-2019/Citrus 2018-2019.xlsx', finalRowCount: 0 },
];

const stoneFruitDataFiles = [
  { path: '2020-2021/Stone Fruit 2020-2021.xlsx', finalRowCount: 1261 },
  // { path: '2019-2020/Stone Fruit 2019-2020.xlsx', finalRowCount: 0 },
  // { path: '2018-2019/Stone Fruit 2018-2019.xlsx', finalRowCount: 0 },
  // { path: '2017-2018/Stone fruit inspection 2017-2018.xlsx', finalRowCount: 0 },
];

const pomegranateDataFiles = [
  { path: 'Pomegranate 2020-2021.xlsx', finalRowCount: 83 },
  // { path: '2019-2020/Pomegranates 2020.xlsx', finalRowCount: 0 },
  // { path: '2018-2019/Pomegranates 2019.xlsx', finalRowCount: 0 },
  // { path: '2017-2018/Pomegranate -2018.xlsx', finalRowCount: 0 },
];

const persimmonDataFiles = [
  { path: 'Persimmon 2020-2021.xlsx', finalRowCount: 15 },
  // { path: '2018-2019/Persimmons 2019.xlsx', finalRowCount: 0 },
];

const pearDataFiles = [
  { path: 'Pears 2021.xlsx', finalRowCount: 56 },
  // { path: '2019-2020/Pears 2020.xlsx', finalRowCount: 0 },
  // { path: '2018-2019/Pears 2019.xlsx', finalRowCount: 0 },
  // { path: '2017-2018/Pears 2017-2018.xlsx', finalRowCount: 0 },
];

const lemonDataFiles = [
  { path: 'Lemons 2021.xlsx', finalRowCount: 93 },
  // { path: '2019-2020/Lemons 2020.xlsx', finalRowCount: 0 },
  // { path: '2018-2019/Lemons 2019.xlsx', finalRowCount: 0 },
];

const cherryDataFiles = [
  { path: '2020-2021/Cherries 2020-2021.xlsx', finalRowCount: 57 },
  // { path: '2019-2020/Cherries 2019 - 2020.xlsx', finalRowCount: 0 },
  // { path: '2018-2019/Cherries 2018-2019.xlsx', finalRowCount: 0 },
  // { path: '2017-2018/Cherries 2017-2018.xlsx', finalRowCount: 0 },
];

const appleDataFiles = [
  { path: '2019-2020/Apple 2020.xlsx', finalRowCount: 18 },
  // { path: '2018-2019/Apples 2019.xlsx', finalRowCount: 0 },
];

const fetchPsaPallets = (
  groupName,
  dataFiles,
  keys,
  gqlCountRequest,
  gqlCreateRequest,
) => {
  console.log(
    `\n\nFetching PSA ${groupName} pallets: ${new Date().toString()}\n\n`,
  );

  const gqlResponseKey = `psa${
    groupName[0].toUpperCase() + groupName.slice(1, groupName.length)
  }Pallets`;
  const gqlCreateKey = `batchCreatePsa${
    groupName[0].toUpperCase() + groupName.slice(1, groupName.length)
  }Pallet`;

  const file = XLSX.readFile(`/jv-qc-inspections/${dataFiles[0].path}`);
  const sheetData = file.Sheets[file.SheetNames[0]];

  const previousYearsPalletsCount = dataFiles
    .slice(1, dataFiles.length)
    .reduce((acc, file) => acc + file.finalRowCount, 0);

  gqlClient
    .request(gqlCountRequest)
    .then(({ [gqlResponseKey]: { totalCount } }) => {
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

          keys.forEach((key, idx) => {
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
          .request(gqlCreateRequest, {
            input: {
              newPallets,
            },
          })
          .then(({ [gqlCreateKey]: { [gqlResponseKey]: psaPallets } }) => {
            console.log(`Pallets added to database: ${psaPallets.length}`);
          })
          .catch(onError);
      });
    })
    .catch(onError);
};

const fetchPsaGrapePallets = () =>
  fetchPsaPallets(
    'grape',
    grapeDataFiles,
    grapeKeys,
    PSA_GRAPE_PALLET_COUNT,
    BATCH_CREATE_PSA_GRAPE_PALLET,
  );

const fetchPsaCitrusPallets = () =>
  fetchPsaPallets(
    'citrus',
    citrusDataFiles,
    citrusKeys,
    PSA_CITRUS_PALLET_COUNT,
    BATCH_CREATE_PSA_CITRUS_PALLET,
  );

const fetchPsaStoneFruitPallets = () =>
  fetchPsaPallets(
    'stoneFruit',
    stoneFruitDataFiles,
    stoneFruitKeys,
    PSA_STONE_FRUIT_PALLET_COUNT,
    BATCH_CREATE_PSA_STONE_FRUIT_PALLET,
  );

const fetchPsaPomegranatePallets = () =>
  fetchPsaPallets(
    'pomegranate',
    pomegranateDataFiles,
    pomegranateKeys,
    PSA_POMEGRANATE_PALLET_COUNT,
    BATCH_CREATE_PSA_POMEGRANATE_PALLET,
  );

const fetchPsaPersimmonPallets = () =>
  fetchPsaPallets(
    'persimmon',
    persimmonDataFiles,
    persimmonKeys,
    PSA_PERSIMMON_PALLET_COUNT,
    BATCH_CREATE_PSA_PERSIMMON_PALLET,
  );

const fetchPsaPearPallets = () =>
  fetchPsaPallets(
    'pear',
    pearDataFiles,
    pearKeys,
    PSA_PEAR_PALLET_COUNT,
    BATCH_CREATE_PSA_PEAR_PALLET,
  );

const fetchPsaLemonPallets = () =>
  fetchPsaPallets(
    'lemon',
    lemonDataFiles,
    lemonKeys,
    PSA_LEMON_PALLET_COUNT,
    BATCH_CREATE_PSA_LEMON_PALLET,
  );

const fetchPsaCherryPallets = () =>
  fetchPsaPallets(
    'cherry',
    cherryDataFiles,
    cherryKeys,
    PSA_CHERRY_PALLET_COUNT,
    BATCH_CREATE_PSA_CHERRY_PALLET,
  );

const fetchPsaApplePallets = () =>
  fetchPsaPallets(
    'apple',
    appleDataFiles,
    appleKeys,
    PSA_APPLE_PALLET_COUNT,
    BATCH_CREATE_PSA_APPLE_PALLET,
  );

module.exports = {
  fetchPsaGrapePallets,
  fetchPsaCitrusPallets,
  fetchPsaStoneFruitPallets,
  fetchPsaPomegranatePallets,
  fetchPsaPersimmonPallets,
  fetchPsaPearPallets,
  fetchPsaLemonPallets,
  fetchPsaCherryPallets,
  fetchPsaApplePallets,
};
