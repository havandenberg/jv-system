const fs = require('fs');
const { gql, makeExtendSchemaPlugin } = require('graphile-utils');
const path = require('path');

const dataRoot = '/peru-departure-inspections';

const extendSchemaPlugin = makeExtendSchemaPlugin({
  typeDefs: gql`
    extend type PeruDepartureInspection {
      imageUrls: [String!] @requires(columns: ["container_id"])
    }
  `,
  resolvers: {
    PeruDepartureInspection: {
      async imageUrls({ containerId }) {
        const imagesDir = `${dataRoot}/${containerId}/images`;
        if (fs.existsSync(imagesDir)) {
          return fs
            .readdirSync(imagesDir)
            .filter(
              (imageFile) => path.extname(imageFile).toLowerCase() === '.jpg',
            )
            .map((imageFile) =>
              path.join(
                `peru-departure-inspections/${containerId}/images`,
                imageFile,
              ),
            );
        }
        return [];
      },
    },
  },
});

module.exports = extendSchemaPlugin;
