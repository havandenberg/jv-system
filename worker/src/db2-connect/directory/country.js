const { gql } = require('../../api');

const COUNTRY_LIST = gql`
  query COUNTRY_LIST {
    countries {
      nodes {
        id
        countryName
      }
    }
  }
`;

const BULK_UPSERT_COUNTRY = gql`
  mutation BULK_UPSERT_COUNTRY($input: BulkUpsertCountryInput!) {
    bulkUpsertCountry(input: $input) {
      clientMutationId
    }
  }
`;

const BULK_DELETE_COUNTRY = gql`
  mutation BULK_DELETE_COUNTRY($input: BulkDeleteCountryInput!) {
    bulkDeleteCountry(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedCountry = (country, db2Country) => ({
  ...country,
  id: db2Country['CNTRYL'],
  countryName: db2Country['CNAMEL'],
});

const countryOptions = {
  db2Query: 'select * from JVFIL.INVP511L;',
  listQuery: COUNTRY_LIST,
  upsertQuery: BULK_UPSERT_COUNTRY,
  deleteQuery: BULK_DELETE_COUNTRY,
  itemName: 'country',
  itemPluralName: 'countries',
  itemQueryName: 'countries',
  upsertQueryName: 'countries',
  getUpdatedItem: getUpdatedCountry,
  idKey: 'CNTRYL',
};

module.exports = countryOptions;
