const getActive = (active) => (active.length > 0 ? false : true);

const getCountryId = (countryId) =>
  ['CDA', 'CD0', 'CD1'].includes(countryId)
    ? 'CAN'
    : ['SA'].includes(countryId)
    ? 'SAF'
    : ['US1', 'USE', ''].includes(countryId)
    ? 'USA'
    : countryId;

const invalidDates = ['2002-09-31'];

const getDate = (day, month, year) => {
  const dateString =
    day && month && year
      ? `2${('' + year).padStart(3, '0')}-${('' + month).padStart(2, '0')}-${(
          '' + day
        ).padStart(2, '0')}`
      : null;

  return !invalidDates.includes(dateString) ? dateString : null;
};

const getPhone = (area, exc, tel) => `${area || ''}${exc || ''}${tel || ''}`;

const getZipCode = (zipCode) => `${parseInt(zipCode, 10)}`.padStart(5, '0');

module.exports = {
  getActive,
  getCountryId,
  getDate,
  getPhone,
  getZipCode,
};
