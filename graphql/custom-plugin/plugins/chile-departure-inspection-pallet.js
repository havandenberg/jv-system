const fs = require('fs');
const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const path = require('path');

const dataRoot = '/chile-departure-inspections';

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    extend type ChileDepartureInspectionPallet {
      imageUrls: [String!] @requires(columns: ["lot_id"])
    }
  `,
  resolvers: {
    ChileDepartureInspectionPallet: {
      async imageUrls({ lotId }) {
        const imagesDir = `${dataRoot}/${lotId}`;
        if (fs.existsSync(imagesDir)) {
          return fs
            .readdirSync(imagesDir)
            .filter(
              (imageFile) => path.extname(imageFile).toLowerCase() === '.jpg',
            )
            .map((imageFile) =>
              path.join(`chile-departure-inspections/${lotId}`, imageFile),
            );
        }
        return [];
      },
    },
  },
});

module.exports = extendSchemaPlugin;
