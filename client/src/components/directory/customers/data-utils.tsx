import { loader } from 'graphql.macro';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Customer } from 'types';
import ty from 'ui/typography';

const CUSTOMER_DISTINCT_COLUMN_VALUES_QUERY = loader(
  '../../../api/directory/customer/distinct-column-values.gql',
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
        query: CUSTOMER_DISTINCT_COLUMN_VALUES_QUERY,
        queryName: 'customerDistinctColumnValues',
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
        query: CUSTOMER_DISTINCT_COLUMN_VALUES_QUERY,
        queryName: 'customerDistinctColumnValues',
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
    readOnly: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
    readOnly: true,
  },
  {
    key: 'address1',
    label: 'Address 1',
    readOnly: true,
  },
  {
    key: 'address2',
    label: 'Address 2',
    readOnly: true,
  },
  {
    key: 'city',
    label: 'City',
    readOnly: true,
  },
  {
    key: 'postalState',
    label: 'State',
    readOnly: true,
  },
  {
    key: 'zipCode',
    label: 'Zip Code',
    readOnly: true,
  },
  {
    key: 'countryId',
    label: 'Country',
    readOnly: true,
    getValue: (data) =>
      data.country ? (
        <ty.BodyText>{data.country?.countryName}</ty.BodyText>
      ) : (
        ''
      ),
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
