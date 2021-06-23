import { loader } from 'graphql.macro';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Customer } from 'types';

const CUSTOMER_DISTINCT_VALUES_QUERY = loader(
  '../../../api/directory/customer/distinct-values.gql',
);

export type CustomerLabelInfo = LabelInfo<Customer>;

export const listLabels: CustomerLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'id',
    label: 'ID',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'customerName',
    label: 'Customer Name',
    sortable: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'city',
    label: 'City',
    filterPanelProps: {
      customStyles: { left: -71, width: 364 },
      queryProps: {
        query: CUSTOMER_DISTINCT_VALUES_QUERY,
        queryName: 'customerDistinctValues',
        queryVariables: {
          columnName: 'city',
          conditionName: 'active',
          conditionValue: 'true',
        },
      },
      showSearch: true,
    },
    filterable: true,
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'postalState',
    label: 'State',
    filterPanelProps: {
      columnCount: 3,
      customStyles: { left: -208 },
      queryProps: {
        query: CUSTOMER_DISTINCT_VALUES_QUERY,
        queryName: 'customerDistinctValues',
        queryVariables: {
          columnName: 'postal_state',
          conditionName: 'active',
          conditionValue: 'true',
        },
      },
      showSearch: true,
    },
    filterable: true,
    sortable: true,
  },
];

export const baseLabels: CustomerLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
    readOnly: true,
  },
  {
    key: 'customerName',
    label: 'Customer Name',
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
    key: 'notes',
    label: 'Notes',
  },
  {
    key: 'website',
    label: 'Website',
    transformKey: 'link',
  },
];
