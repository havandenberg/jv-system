import { LabelInfo } from 'components/column-label';
import { times } from 'ramda';
import { TruckRate } from 'types';
import ty from 'ui/typography';
import { formatCurrency } from 'utils/format';
import postalStates from 'utils/postal-states';

const PALLETS_PER_TRUCK_LOAD = 18;

export type TruckRateLabelInfo = LabelInfo<TruckRate>;

export const indexListLabels: TruckRateLabelInfo[] = [
  {
    key: 'locationDescription',
    label: 'Description',
    validate: ({ locationDescription }) => !!locationDescription,
  },
  {
    key: 'isDefault',
    label: 'Default?',
    isBoolean: true,
    getValue: ({ isDefault }) => (
      <ty.BodyText>{isDefault ? 'Yes' : 'No'}</ty.BodyText>
    ),
  },
  {
    key: 'fullLoadRate',
    label: `Full Load`,
    getValue: ({ fullLoadRate }) => (
      <ty.BodyText>
        {fullLoadRate ? formatCurrency(parseFloat(fullLoadRate), true) : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'palletRate1',
    label: `Pallet Rates`,
    getValue: (truckRate) => (
      <ty.BodyText>{getPalletRatesDescription(truckRate) || '-'}</ty.BodyText>
    ),
  },
];

export const listLabels: TruckRateLabelInfo[] = [
  {
    key: 'postalState',
    label: 'State',
    sortable: true,
    dropdownOptions: [{ content: '', value: '' }, ...postalStates],
    validate: ({ postalState }) => !!postalState,
  },
  ...indexListLabels.slice(1),
  {
    key: 'notes',
    label: 'Notes',
  },
];

export const baseLabels: TruckRateLabelInfo[] = [
  {
    key: 'vendorId',
    label: 'Vendor',
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.vendorName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
    readOnly: true,
  },
  indexListLabels[0],
  {
    key: 'postalState',
    label: 'State',
    sortable: true,
    dropdownOptions: [{ content: '', value: '' }, ...postalStates],
    validate: ({ postalState }) => !!postalState,
  },
  ...indexListLabels.slice(1, 3),
  ...times((idx) => {
    const count = idx + 1;
    const key = `palletRate${count}` as keyof TruckRate;
    return {
      key,
      label: `${count} Pallet${count > 1 ? 's' : ''}`,
      getValue: (truckRate) => (
        <ty.BodyText>
          {truckRate[key] !== '0'
            ? formatCurrency(parseFloat(truckRate[key]), true)
            : '-'}
        </ty.BodyText>
      ),
    } as TruckRateLabelInfo;
  }, 15),
  {
    key: 'notes',
    label: 'Notes',
  },
];

export const getPalletRatesDescription = (truckRate: TruckRate) => {
  const palletRates = times((idx) => {
    const count = idx + 1;
    const key = `palletRate${count}` as keyof TruckRate;
    return truckRate[key];
  }, 15)
    .map((rate, idx) => {
      const count = idx + 1;
      return `${count} - ${formatCurrency(parseFloat(rate), true)}`;
    })
    .filter((rate) => !rate.includes('$0'));

  return palletRates.join(', ');
};

export const getClosestPalletRate = (
  truckRate: TruckRate,
  palletCount: number,
) => {
  const palletRates = times((idx) => {
    const count = idx + 1;
    const key = `palletRate${count}` as keyof TruckRate;
    return truckRate[key];
  }, 15)
    .map((rate) => parseFloat(rate))
    .filter((rate) => rate !== 0);

  const closestPalletRate = palletRates.reduce((acc, curr) => {
    const currDiff = Math.abs(curr - palletCount);
    const accDiff = Math.abs(acc - palletCount);
    return currDiff < accDiff ? curr : acc;
  }, palletRates[0]);

  const weightByFullLoad =
    parseFloat(truckRate.fullLoadRate) / PALLETS_PER_TRUCK_LOAD;

  return closestPalletRate || weightByFullLoad || 0;
};
