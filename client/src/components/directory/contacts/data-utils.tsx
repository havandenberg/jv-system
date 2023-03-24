import { sentenceCase } from 'change-case';
import { pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Customer, PersonContact, Shipper, Vendor, Warehouse } from 'types';
import ty from 'ui/typography';

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
    key: 'homeExtension',
    label: 'Home Extension',
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
    label: 'Status',
    isBoolean: true,
    getValue: (data) => (!!data.isPrimary ? 'Active' : 'Inactive'),
  },
];

export const groupContactListLabels: (
  hasCustomerIds: boolean,
  hasShipperIds: boolean,
  hasWarehouseIds: boolean,
  hasVendorIds: boolean,
) => PersonContactLabelInfo[] = (
  hasCustomerIds: boolean,
  hasShipperIds: boolean,
  hasWarehouseIds: boolean,
  hasVendorIds: boolean,
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
  if (hasVendorIds) {
    companyLabels.push({
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'vendorsByVendorPersonContactPersonContactIdAndVendorId',
      label: 'Vendor(s)',
      getValue: (data) =>
        data.vendorsByVendorPersonContactPersonContactIdAndVendorId
          ? pluck(
              'vendorName',
              data.vendorsByVendorPersonContactPersonContactIdAndVendorId
                .nodes as Vendor[],
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

export const baseLabels: (
  editing: boolean,
  isInternal?: boolean,
) => PersonContactLabelInfo[] = (editing, isInternal) => {
  const internalLabels: PersonContactLabelInfo[] = isInternal
    ? []
    : [
        {
          key: 'isPrimary',
          label: editing ? 'Active' : 'Status',
          isBoolean: true,
          getValue: (data) => (
            <ty.BodyText>
              {!!data.isPrimary ? 'Active' : 'Inactive'}
            </ty.BodyText>
          ),
        },
      ];
  return [
    {
      key: 'firstName',
      label: 'First Name',
      validate: ({ firstName }) => firstName.length > 0,
    },
    {
      key: 'lastName',
      label: 'Last Name',
      validate: ({ lastName }) => lastName.length > 0,
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
      key: 'roles',
      label: 'Role(s)',
    },
    {
      key: 'homePhone',
      label: 'Home Phone',
      transformKey: 'phone',
    },
    {
      key: 'homeExtension',
      label: 'Home Extension',
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
    ...internalLabels,
  ];
};
