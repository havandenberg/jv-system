import { isAfter, isBefore } from 'date-fns';

import { COUNTRY_LIST_QUERY } from 'api/directory/country';
import { WAREHOUSE_LIST_ALL_QUERY } from 'api/directory/warehouse';
import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { Country, Vessel, Warehouse } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatShortDate } from 'utils/date';

export type VesselLabelInfo = LabelInfo<Vessel>;

export const listLabels: (
  vesselCodeOptions: string[],
  arrivalPortOptions: string[],
  countryIdOptions: string[],
) => VesselLabelInfo[] = (
  vesselCodeOptions,
  arrivalPortOptions,
  countryIdOptions,
) => [
  {
    key: 'dischargeDate',
    label: 'Available Date',
    sortable: true,
  },
  {
    key: 'vesselCode',
    label: 'Code',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      customStyles: {
        width: 500,
      },
      customOptions: vesselCodeOptions,
      showSearch: true,
    },
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'vesselName',
    label: 'Vessel Name',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'countryId',
    label: 'Country',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      customOptions: countryIdOptions,
      showSearch: true,
    },
    getValue: ({ country }) =>
      country ? <ty.BodyText>{country.countryName}</ty.BodyText> : '',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'arrivalPort',
    label: 'Arrival Port',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      customStyles: {
        left: -80,
        width: 450,
      },
      customOptions: arrivalPortOptions,
      showSearch: true,
    },
    getValue: ({ warehouse }) =>
      warehouse ? `${warehouse.warehouseName} (${warehouse.id})` : '',
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'isPre',
    label: 'PRE',
    sortable: true,
    isBoolean: true,
    getValue: ({ isPre }) =>
      isPre ? (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator status="warning" />
        </l.Flex>
      ) : (
        ''
      ),
  },
];

const getDateValidationArgs = ({
  arrivalDate,
  departureDate,
  dischargeDate,
}: Vessel) => {
  const arrival =
    arrivalDate && typeof arrivalDate === 'string'
      ? new Date(arrivalDate.replace(/-/g, '/'))
      : arrivalDate;
  const departure =
    departureDate && typeof departureDate === 'string'
      ? new Date(departureDate.replace(/-/g, '/'))
      : departureDate;
  const discharge =
    dischargeDate && typeof dischargeDate === 'string'
      ? new Date(dischargeDate.replace(/-/g, '/'))
      : dischargeDate;
  return {
    arrival,
    departure,
    discharge,
  };
};

export const baseLabels: (
  countries: Country[],
  warehouses: Warehouse[],
) => VesselLabelInfo[] = (countries, warehouses) => [
  {
    key: 'vesselCode',
    label: 'Vessel Code',
    readOnly: true,
  },
  {
    key: 'vesselName',
    label: 'Vessel Name',
    readOnly: true,
  },
  {
    key: 'countryId',
    label: 'Country Of Origin',
    readOnly: true,
    itemSelectorQueryProps: {
      errorLabel: 'countries',
      getItemContent: ({ countryName, id }: Country) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {countryName}
        </ty.BodyText>
      ),
      query: COUNTRY_LIST_QUERY,
      queryName: 'countries',
      width: 300,
    },
    getValue: ({ country }) =>
      country ? (
        <ty.BodyText>{country.countryName}</ty.BodyText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
    validate: ({ countryId }) =>
      !!countryId && !!countries.find((c) => c.id === countryId),
  },
  {
    key: 'arrivalPort',
    label: 'Port Of Arrival',
    readOnly: true,
    itemSelectorQueryProps: {
      errorLabel: 'locations',
      getItemContent: ({ id, warehouseName }: Warehouse) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {warehouseName}
        </ty.BodyText>
      ),
      query: WAREHOUSE_LIST_ALL_QUERY,
      queryName: 'warehouses',
      width: 300,
    },
    getValue: ({ warehouse }) =>
      warehouse ? (
        <ty.LinkText
          hover="false"
          to={`/directory/warehouses/${warehouse?.id}`}
        >
          {warehouse.id} - {warehouse.warehouseName}
        </ty.LinkText>
      ) : (
        ''
      ),
    validate: ({ arrivalPort }) =>
      !!arrivalPort && !!warehouses.find((w) => w.id === arrivalPort),
  },
  {
    key: 'coast',
    label: 'Coast',
    dropdownOptions: [
      {
        value: 'EC',
      },
      {
        value: 'WC',
      },
    ],
    readOnly: true,
  },
  {
    key: 'dischargeDate',
    label: 'Available Date',
    isDate: true,
    readOnly: true,
    validate: (vessel) => {
      const { arrival, departure, discharge } = getDateValidationArgs(vessel);
      return (
        arrival &&
        departure &&
        discharge &&
        isAfter(discharge, arrival) &&
        isAfter(discharge, departure)
      );
    },
  },
  {
    key: 'arrivalDate',
    label: 'Arrival Date',
    isDate: true,
    readOnly: true,
    validate: (vessel) => {
      const { arrival, departure, discharge } = getDateValidationArgs(vessel);
      return (
        arrival &&
        departure &&
        discharge &&
        isBefore(arrival, discharge) &&
        isAfter(arrival, departure)
      );
    },
  },
  {
    key: 'departureDate',
    label: 'Departure Date',
    isDate: true,
    readOnly: true,
    validate: (vessel) => {
      const { arrival, departure, discharge } = getDateValidationArgs(vessel);
      return (
        arrival &&
        departure &&
        discharge &&
        isBefore(departure, arrival) &&
        isBefore(departure, discharge)
      );
    },
  },
  {
    key: 'invFlag',
    label: 'Inv Flag',
    isBoolean: true,
    readOnly: true,
    getValue: ({ invFlag }) => (
      <ty.BodyText>{!!invFlag ? 'Yes' : 'No'}</ty.BodyText>
    ),
  },
  {
    key: 'isPre',
    label: 'PRE',
    sortable: true,
    isBoolean: true,
    readOnly: true,
    getValue: ({ isPre }) =>
      isPre ? (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator status="warning" />
        </l.Flex>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'scheduleNotes',
    label: 'Schedule Notes',
    getValue: ({ scheduleNotes }) => (
      <ty.BodyText>{scheduleNotes || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'isAvailable',
    label: 'Available',
    getValue: ({ isAvailable }) => (
      <LineItemCheckbox
        checked={!!isAvailable}
        disabled
        onChange={() => ({})}
      />
    ),
    isBoolean: true,
  },
];

export const scheduleListLabels: VesselLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'dischargeDate',
    label: 'Available',
    sortable: true,
    getValue: ({ dischargeDate }) => (
      <ty.BodyText>
        {dischargeDate
          ? formatShortDate(new Date(dischargeDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'arrivalDate',
    label: 'Arrival',
    sortable: true,
    getValue: ({ arrivalDate }) => (
      <ty.BodyText>
        {arrivalDate
          ? formatShortDate(new Date(arrivalDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'vesselCode',
    label: 'Code',
    sortable: true,
  },
  {
    key: 'vesselName',
    label: 'Vessel Name',
  },
  {
    key: 'arrivalPort',
    label: 'Arrival Port',
    getValue: ({ warehouse }) => (
      <ty.BodyText>
        {warehouse ? `${warehouse.warehouseName} (${warehouse.id})` : ''}
      </ty.BodyText>
    ),
  },
  {
    key: 'isPre',
    label: 'PRE',
    isBoolean: true,
    getValue: ({ isPre }) =>
      isPre ? (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator status="warning" />
        </l.Flex>
      ) : (
        <ty.BodyText center>-</ty.BodyText>
      ),
  },
  {
    key: 'scheduleNotes',
    label: 'Notes',
    getValue: ({ scheduleNotes }) => (
      <ty.BodyText>{scheduleNotes || '-'}</ty.BodyText>
    ),
  },
];
