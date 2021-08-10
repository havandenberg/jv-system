import { ARRIVAL_PORT_DISTINCT_VALUES_QUERY } from 'api/sales/inventory/vessel';
import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Vessel } from 'types';
import ty from 'ui/typography';

export type VesselLabelInfo = LabelInfo<Vessel>;

export const listLabels: VesselLabelInfo[] = [
  {
    key: 'dischargeDate',
    label: 'Discharge Date',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'coast',
    label: 'Coast',
    sortable: true,
    filterable: true,
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
    getValue: ({ country }) => (country ? country.countryName : ''),
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
        width: 380,
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
];

export const baseLabels: VesselLabelInfo[] = [
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
    getValue: ({ country }) => (country ? country.countryName : ''),
  },
  {
    key: 'arrivalPort',
    label: 'Port Of Arrival',
    getValue: ({ warehouse }) =>
      warehouse ? (
        <ty.LinkText hover="false" to={`/directory/warehouses/${warehouse.id}`}>
          {warehouse.warehouseName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'coast',
    label: 'Coast',
  },
  {
    key: 'dischargeDate',
    label: 'Discharge Date',
  },
  {
    key: 'arrivalDate',
    label: 'Arrival Date',
  },
  {
    key: 'departureDate',
    label: 'Departure Date',
  },
];
