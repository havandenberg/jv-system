const async = require('async');
const fs = require('fs');
const parse = require('csv-parse');
const path = require('path');
const R = require('ramda');
const transform = require('stream-transform');
const dateFns = require('date-fns');

const dataRoot = process.env.INSPECTIONS_DIRECTORY;

const emptyPallet = {
  id: '',
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

const formatDate = (date) => dateFns.format(date, 'MM/dd/yyyy');

const inspectionsController = (request, response) => {
  const directories = fs
    .readdirSync(dataRoot, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);

  const results = [];

  async.eachSeries(
    directories,
    (reportDir, callback) => {
      fs.readFile(`${dataRoot}/${reportDir}/data.json`, (error, content) => {
        const imagesDir = `${dataRoot}/${reportDir}/images`;
        const images = fs
          .readdirSync(imagesDir)
          .filter(
            (imageFile) => path.extname(imageFile).toLowerCase() === '.jpg',
          )
          .map((imageFile) => path.join(`/${reportDir}/images`, imageFile));
        if (error) {
          fs.readFile(`${dataRoot}/${reportDir}/data.csv`, (er, co) => {
            if (!er) {
              parse(
                co,
                {
                  trim: true,
                  skip_empty_lines: true,
                  skip_lines_with_empty_values: true,
                },
                (err, output) => {
                  if (!err) {
                    transform(
                      output,
                      (record) => record.filter((rec) => rec),
                      (err, op) => {
                        if (!err) {
                          let lastPalletIndex = -1;
                          op.map((val, index) => {
                            if (
                              JSON.stringify(val) ===
                              JSON.stringify(['QC Comments:'])
                            ) {
                              lastPalletIndex = index;
                            }
                          });
                          let reportData = {
                            avgBunchesPerBox: R.pathOr(0, [-3, 3], op),
                            avgNetWeight: R.pathOr(0, [-3, 2], op),
                            bagsPerBox: R.pathOr(0, [4, 5], op),
                            bagType: '',
                            brand: R.pathOr('', [2, 3], op),
                            brixMax: R.pathOr(0, [-3, 5], op),
                            brixAvg: R.pathOr(0, [-2, 1], op),
                            brixMin: R.pathOr(0, [-1, 1], op),
                            category: R.pathOr('', [3, 3], op),
                            comments: 'Testing',
                            conditionScore: R.pathOr('', [-3, 1], op),
                            containerId: reportDir,
                            destination: R.pathOr('', [3, 1], op),
                            departureWeek: R.pathOr('', [4, 2], op),
                            exporter: R.pathOr('', [1, 1], op),
                            inspectionDate: formatDate(
                              new Date(R.pathOr('', [5, 2], op)),
                            ),
                            packingDate: formatDate(
                              new Date(R.pathOr('', [4, 1], op)),
                            ),
                            packingHouse: R.pathOr('', [2, 1], op),
                            packingMaterial: R.pathOr('', [4, 4], op),
                            presentation: R.pathOr('', [3, 4], op),
                            qualityScore: R.pathOr('', [-3, 0], op),
                            variety: R.pathOr('', [1, 3], op),
                            pallets: op.slice(7, lastPalletIndex).map((val) =>
                              R.mapObjIndexed((v, key) => {
                                const isAverage =
                                  val[0].toLowerCase() === 'average';
                                if (isAverage && key === 'size') {
                                  return '';
                                }
                                const modifyIndex =
                                  isAverage && !['id', 'size'].includes(key);
                                const index =
                                  Object.keys(emptyPallet).indexOf(key) +
                                  (modifyIndex ? -1 : 0);
                                const floatValue = parseFloat(val[index], 10);
                                return floatValue || val[index];
                              }, emptyPallet),
                            ),
                          };
                          reportData.imageUrls = images;
                          results.push(reportData);
                          callback();
                        }
                      },
                    );
                  }
                },
              );
            }
          });
        } else {
          const reportData = JSON.parse(content);
          const imagesDir = `${dataRoot}/${reportDir}/images`;
          const images = fs
            .readdirSync(imagesDir)
            .filter(
              (imageFile) => path.extname(imageFile).toLowerCase() === '.jpg',
            )
            .map((imageFile) => path.join(`/${reportDir}/images`, imageFile));
          reportData.imageUrls = images;
          results.push(reportData);
          callback();
        }
      });
    },
    () => {
      response.send(results);
    },
  );
};

module.exports = inspectionsController;
