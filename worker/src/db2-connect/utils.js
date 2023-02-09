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

const getDateTime = (dateInput, timeInput, hasSeconds) => {
  const dateString = `${dateInput}`.padStart(6, '0');
  const date = `20${dateString.substring(0, 2)}-${dateString.substring(
    2,
    4,
  )}-${dateString.substring(4, 6)}`;

  const isValidDate = Date.parse(date);
  if (!isValidDate) {
    return null;
  }

  if (timeInput === null || timeInput === undefined) {
    return date;
  }

  const parseSeconds = hasSeconds || `${timeInput}`.length > 4;
  const timeString = `${timeInput}`.padStart(parseSeconds ? 6 : 4, '0');
  const dateTimeString = parseSeconds
    ? `${date}T${timeString.substring(0, 2)}:${timeString.substring(
        2,
        4,
      )}:${timeString.substring(4, 6)}`
    : `${date}T${timeString.substring(0, 2)}:${timeString.substring(2, 4)}:00`;

  const isValid = Date.parse(dateTimeString);

  return isValid ? dateTimeString : null;
};

const getPhone = (area, exc, tel) => `${area || ''}${exc || ''}${tel || ''}`;

const getZipCode = (zipCode) => `${parseInt(zipCode, 10)}`.padStart(5, '0');

module.exports = {
  getActive,
  getCountryId,
  getDate,
  getDateTime,
  getPhone,
  getZipCode,
};
