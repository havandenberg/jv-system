const fs = require('fs');
const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const path = require('path');

const dataRoot = '/psa-arrival-inspections';

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    extend type PsaArrivalPicture {
      imageUrl: String!
        @requires(
          columns: ["arrival_code", "exporter_id", "id", "picture_date"]
        )
    }
    extend type PsaArrivalReport {
      reportUrl: String!
        @requires(columns: ["arrival_code", "exporter_id", "id", "report_date"])
    }
  `,
  resolvers: {
    PsaArrivalPicture: {
      async imageUrl({ arrivalCode, exporterId, id, pictureDate }) {
        const imagesDir = `${dataRoot}/${pictureDate}/${arrivalCode}-${exporterId}`;
        if (fs.existsSync(imagesDir)) {
          const image = fs
            .readdirSync(imagesDir)
            .find(
              (imageFile) =>
                path.extname(imageFile).toLowerCase() === '.jpg' &&
                path.basename(imageFile, '.jpg') === id,
            );
          return image ? path.join(imagesDir, image) : '';
        }
        return '';
      },
    },
    PsaArrivalReport: {
      async reportUrl({ arrivalCode, exporterId, id, reportDate }) {
        const reportDir = `${dataRoot}/${reportDate}/${arrivalCode}-${exporterId}`;
        if (fs.existsSync(reportDir)) {
          const file = fs
            .readdirSync(reportDir)
            .find(
              (reportFile) =>
                path.extname(reportFile).toLowerCase() === '.pdf' &&
                path.basename(reportFile, '.pdf') === `report-${id}`,
            );
          return file ? path.join(reportDir, file) : '';
        }
        return '';
      },
    },
  },
});

module.exports = extendSchemaPlugin;
