const { gql } = require('../../api');

const SPECIES_LIST = gql`
  query SPECIES_LIST {
    productSpecieses(orderBy: ID_ASC) {
      nodes {
        id
        speciesDescription
        secondaryDescription
        fdaProductCode
        fdaIndustryCode
        defaultTemperature
      }
    }
  }
`;

const BULK_UPSERT_SPECIES = gql`
  mutation BULK_UPSERT_PRODUCT_SPECIES($input: BulkUpsertProductSpeciesInput!) {
    bulkUpsertProductSpecies(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_SPECIES = gql`
  mutation BULK_DELETE_PRODUCT_SPECIES($input: BulkDeleteProductSpeciesInput!) {
    bulkDeleteProductSpecies(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedSpecies = (species, db2Species) => ({
  ...species,
  id: db2Species['PRODA'],
  speciesDescription: db2Species['DSCPA'],
  secondaryDescription: db2Species['GRUPA'],
  fdaProductCode: db2Species['FDAPRA'],
  fdaIndustryCode: db2Species['FDACDA'],
  defaultTemperature: db2Species['TEMPA'],
});

const speciesOptions = {
  db2Query: 'select * from JVFIL.INVP200A;',
  listQuery: SPECIES_LIST,
  deleteQuery: BULK_DELETE_SPECIES,
  upsertQuery: BULK_UPSERT_SPECIES,
  itemName: 'species',
  itemPluralName: 'species',
  itemQueryName: 'productSpecieses',
  upsertQueryName: 'specieses',
  getUpdatedItem: getUpdatedSpecies,
  idKey: 'PRODA',
};

module.exports = speciesOptions;
