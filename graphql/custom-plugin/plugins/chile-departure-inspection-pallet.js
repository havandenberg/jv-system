const fs = require('fs');
const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const path = require('path');

const dataRoot = '/chile-departure-inspections';

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    extend type ChileDepartureInspection {
      imageUrls: [String!] @requires(columns: ["lot_number"])
    }
  `,
  resolvers: {
    ChileDepartureInspection: {
      async imageUrls({ lotNumber }) {
        const imagesDir = `${dataRoot}/${lotNumber}`;
        if (fs.existsSync(imagesDir)) {
          return fs
            .readdirSync(imagesDir)
            .filter(
              (imageFile) => path.extname(imageFile).toLowerCase() === '.jpg',
            )
            .map((imageFile) =>
              path.join(`chile-departure-inspections/${lotNumber}`, imageFile),
            );
        }
        return [];
      },
    },
  },
});

module.exports = extendSchemaPlugin;
