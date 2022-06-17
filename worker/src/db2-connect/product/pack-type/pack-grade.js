const { gql } = require('../../../api');

const PACK_GRADE_LIST = gql`
  query PACK_GRADE_LIST {
    packGrades {
      nodes {
        id
        shipperId
        gradeCode
        gradeDescription
      }
    }
  }
`;

const BULK_UPSERT_PACK_GRADE = gql`
  mutation BULK_UPSERT_PACK_GRADE($input: BulkUpsertPackGradeInput!) {
    bulkUpsertPackGrade(input: $input) {
      clientMutationId
    }
  }
`;

const getUpdatedPackGrade = (packGrade, db2PackGrade, id) => ({
  ...packGrade,
  id,
  shipperId: db2PackGrade['SHPR#V'],
  gradeCode: db2PackGrade['GRADEV'],
  gradeDescription: db2PackGrade['DESCTV'],
});

const getPackGradeId = (db2PackGrade, packGrades) => {
  const packGrade = Object.values(packGrades).find(
    (pa) =>
      pa.shipperId === db2PackGrade['SHPR#V'].trimEnd() &&
      pa.gradeCode === db2PackGrade['GRADEV'].trimEnd(),
  );

  return packGrade?.id || `${db2PackGrade['SHPR#V']}-${db2PackGrade['GRADEV']}`;
};

const packGradeOptions = {
  db2Query: 'select * from JVFIL.INVP521V;',
  listQuery: PACK_GRADE_LIST,
  upsertQuery: BULK_UPSERT_PACK_GRADE,
  itemName: 'pack grade',
  itemPluralName: 'pack grades',
  itemQueryName: 'packGrades',
  upsertQueryName: 'packGrades',
  getUpdatedItem: getUpdatedPackGrade,
  getId: getPackGradeId,
};

module.exports = packGradeOptions;
