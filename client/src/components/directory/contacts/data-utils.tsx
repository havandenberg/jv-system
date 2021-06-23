import { sentenceCase } from 'change-case';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { PersonContact } from 'types';

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

export const aliasContactListLabels: (
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
      key: 'customerId',
      label: 'Customer',
      getValue: (data) =>
        data.customer ? data.customer.customerName : data.customerId || '',
      sortable: true,
    });
  }
  if (hasShipperIds) {
    companyLabels.push({
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'shipperId',
      label: 'Shipper',
      getValue: (data) =>
        data.shipper ? data.shipper.shipperName : data.shipperId || '',
      sortable: true,
    });
  }
  if (hasWarehouseIds) {
    companyLabels.push({
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'warehouseId',
      label: 'Warehouse',
      getValue: (data) =>
        data.warehouse ? data.warehouse.warehouseName : data.warehouseId || '',
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
