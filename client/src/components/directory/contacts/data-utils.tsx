import { sentenceCase } from 'change-case';
import { pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Customer, PersonContact, Shipper, Warehouse } from 'types';

export type PersonContactLabelInfo = LabelInfo<PersonContact>;

export const internalListLabels: PersonContactLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'firstName',
    label: 'First Name',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'lastName',
    label: 'Last Name',
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    transformKey: 'email',
  },
  {
    key: 'workExtension',
    label: 'Work Extension',
  },
];

export const contactListLabels: PersonContactLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'firstName',
    label: 'First Name',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'lastName',
    label: 'Last Name',
    sortable: true,
  },
  {
    key: 'workPhone',
    label: 'Work Phone',
    transformKey: 'phone',
  },
  {
    key: 'email',
    label: 'Email',
    transformKey: 'email',
  },
  {
    key: 'isPrimary',
    label: 'Active',
    isBoolean: true,
    getValue: (data) => sentenceCase((!!data.isPrimary).toString()),
  },
];

export const groupContactListLabels: (
  hasCustomerIds: boolean,
  hasShipperIds: boolean,
  hasWarehouseIds: boolean,
) => PersonContactLabelInfo[] = (
  hasCustomerIds: boolean,
  hasShipperIds: boolean,
  hasWarehouseIds: boolean,
) => {
  const companyLabels: PersonContactLabelInfo[] = [];
  if (hasCustomerIds) {
    companyLabels.push({
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'customersByCustomerPersonContactPersonContactIdAndCustomerId',
      label: 'Customer(s)',
      getValue: (data) =>
        data.customersByCustomerPersonContactPersonContactIdAndCustomerId
          ? pluck(
              'customerName',
              data.customersByCustomerPersonContactPersonContactIdAndCustomerId
                .nodes as Customer[],
            )
              .map((n) => sentenceCase(n))
              .join(', ')
          : '',
      sortable: true,
    });
  }
  if (hasShipperIds) {
    companyLabels.push({
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'shippersByShipperPersonContactPersonContactIdAndShipperId',
      label: 'Shipper(s)',
      getValue: (data) =>
        data.shippersByShipperPersonContactPersonContactIdAndShipperId
          ? pluck(
              'shipperName',
              data.shippersByShipperPersonContactPersonContactIdAndShipperId
                .nodes as Shipper[],
            )
              .map((n) => sentenceCase(n))
              .join(', ')
          : '',
      sortable: true,
    });
  }
  if (hasWarehouseIds) {
    companyLabels.push({
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'warehousesByWarehousePersonContactPersonContactIdAndWarehouseId',
      label: 'Warehouse(s)',
      getValue: (data) =>
        data.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
          ? pluck(
              'warehouseName',
              data
                .warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
                .nodes as Warehouse[],
            )
              .map((n) => sentenceCase(n))
              .join(', ')
          : '',
      sortable: true,
    });
  }
  return [
    {
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'firstName',
      label: 'First Name',
      sortable: true,
    },
    {
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'lastName',
      label: 'Last Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      transformKey: 'email',
    },
    ...companyLabels,
  ];
};

export const baseLabels: (isInternal?: boolean) => PersonContactLabelInfo[] = (
  isInternal,
) => {
  const internalLabels: PersonContactLabelInfo[] = isInternal
    ? []
    : [
        {
          key: 'isPrimary',
          label: 'Active',
          isBoolean: true,
          getValue: (data) => sentenceCase(data.isPrimary.toString()),
        },
      ];
  return [
    {
      key: 'firstName',
      label: 'First Name',
      validate: (val) => val.length > 0,
    },
    {
      key: 'lastName',
      label: 'Last Name',
      validate: (val) => val.length > 0,
    },
    {
      key: 'email',
      label: 'Email',
      transformKey: 'email',
    },
    {
      key: 'secondaryEmail',
      label: 'Secondary Email',
      transformKey: 'email',
    },
    {
      key: 'homePhone',
      label: 'Home Phone',
      transformKey: 'phone',
    },
    {
      key: 'cellPhone',
      label: 'Cell Phone',
      transformKey: 'phone',
    },
    {
      key: 'workPhone',
      label: 'Work Phone',
      transformKey: 'phone',
    },
    {
      key: 'workExtension',
      label: 'Work Extension',
    },
    {
      key: 'roles',
      label: 'Role(s)',
    },
    ...internalLabels,
  ];
};
