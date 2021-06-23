import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Warehouse } from 'types';

export type WarehouseLabelInfo = LabelInfo<Warehouse>;

export const listLabels: WarehouseLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'warehouseName',
    label: 'Warehouse Name',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'city',
    label: 'City',
    filterable: true,
    filterPanelProps: {
      showSearch: true,
    },
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'postalState',
    label: 'State',
    filterPanelProps: {
      columnCount: 3,
      customStyles: {
        left: -197,
      },
    },
    filterable: true,
    sortable: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
  },
];

export const baseLabels: WarehouseLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
    readOnly: true,
  },
  {
    key: 'warehouseName',
    label: 'Warehouse Name',
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
  },
  {
    key: 'address1',
    label: 'Address 1',
  },
  {
    key: 'address2',
    label: 'Address 2',
  },
  {
    key: 'address3',
    label: 'Address 3',
  },
  {
    key: 'city',
    label: 'City',
  },
  {
    key: 'postalState',
    label: 'State',
  },
  {
    key: 'zipCode',
    label: 'Zip Code',
  },
  {
    key: 'countryId',
    label: 'Country',
    getValue: (data) => data.country?.countryName || '',
    readOnly: true,
  },
  {
    key: 'outQueue',
    label: 'Out Queue',
  },
  {
    key: 'stateTaxCode',
    label: 'State Tax Code',
  },
  {
    key: 'countyTaxCode',
    label: 'County Tax Code',
  },
  {
    key: 'cityTaxCode',
    label: 'City Tax Code',
  },
  {
    key: 'miscTaxCode',
    label: 'Misc Tax Code',
  },
];
