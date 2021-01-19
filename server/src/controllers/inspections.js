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
          const imagesDir = `${dataRoot}/${reportDir}/images`;
          const images = fs
            .readdirSync(imagesDir)
            .filter(
              (imageFile) => path.extname(imageFile).toLowerCase() === '.jpg',
            )
            .map((imageFile) => path.join(`/${reportDir}/images`, imageFile));
          reportData.imageUrls = images;
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
