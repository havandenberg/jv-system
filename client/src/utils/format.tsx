export const formatPhoneNumber = (phoneNumberString: string) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

export const formatCurrency = (value: number, round?: boolean) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: round ? 0 : undefined,
  });

export const formatNumber = (value: number, round?: boolean) =>
  formatCurrency(value, round).replace('$', '').slice(0, -3);

export const roundToNearestQuarter = (number: number) =>
  (Math.round(number * 4) / 4).toFixed(2);
