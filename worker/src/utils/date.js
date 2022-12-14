const { format, isAfter, isBefore, isEqual } = require('date-fns');

const formatDate = (date) => format(date, 'yyyy-MM-dd');

const isDateGreaterThanOrEqualTo = (date, dateToCompare) =>
  isEqual(date, dateToCompare) || isAfter(date, dateToCompare);

const isDateLessThanOrEqualTo = (date, dateToCompare) =>
  isEqual(date, dateToCompare) || isBefore(date, dateToCompare);

module.exports = {
  formatDate,
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
};
