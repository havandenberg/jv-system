import { isAfter, isBefore } from 'date-fns';

import { ARRIVAL_PORT_DISTINCT_VALUES_QUERY } from 'api/inventory/vessel';
import { COUNTRY_LIST_QUERY } from 'api/directory/country';
import { WAREHOUSE_LIST_ALL_QUERY } from 'api/directory/warehouse';
import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { Country, Vessel, Warehouse } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export type VesselLabelInfo = LabelInfo<Vessel>;

export const listLabels: VesselLabelInfo[] = [
  {
    key: 'dischargeDate',
    label: 'Available Date',
    sortable: true,
  },
  {
    key: 'vesselCode',
    label: 'Code',
    sortable: true,
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
        width: 410,
      },
      queryProps: {
        query: ARRIVAL_PORT_DISTINCT_VALUES_QUERY,
        queryName: 'vesselArrivalPortDistinctValues',
      },
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
  },
  {
    key: 'vesselName',
    label: 'Vessel Name',
  },
  {
    key: 'countryId',
    label: 'Country Of Origin',
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
  },
  {
    key: 'dischargeDate',
    label: 'Available Date',
    isDate: true,
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
];
