const async = require('async');
const fs = require('fs');
const path = require('path');

const dataRoot = process.env.INSPECTIONS_DIRECTORY;

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
        if (!error) {
          const reportData = JSON.parse(content);
          const images = fs
            .readdirSync(`${dataRoot}/${reportDir}/images`)
            .filter((file) => path.extname(file).toLowerCase() === '.jpg')
            .map((file) => file);
          reportData.images = images;
          results.push(reportData);
        }
        callback();
      });
    },
    () => {
      response.send(results);
    },
  );
};

module.exports = inspectionsController;
