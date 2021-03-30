import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Office } from 'types';

export type OfficeLabelInfo = LabelInfo<Office>;

export const listLabels: OfficeLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'officeName',
    label: 'Office Name',
    sortable: true,
  },
  {
    key: 'companyId',
    label: 'Company Name',
    getValue: (office) => (office.company ? office.company.companyName : ''),
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
  },
  {
    key: 'officeDescription',
    label: 'Description',
  },
];

export const baseLabels: OfficeLabelInfo[] = [
  {
    key: 'officeName',
    label: 'Office Name',
  },
  {
    key: 'companyId',
    label: 'Company Name',
    getValue: (office) => (office.company ? office.company.companyName : ''),
  },
  {
    key: 'officeDescription',
    label: 'Description',
  },
  {
    key: 'phone',
    label: 'Phone Number',
    transformKey: 'phone',
  },
  {
    key: 'secondaryPhone',
    label: 'Secondary Phone Number',
    transformKey: 'phone',
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
    key: 'address1',
    label: 'Address Line 1',
  },
  {
    key: 'address2',
    label: 'Address Line 2',
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
];
