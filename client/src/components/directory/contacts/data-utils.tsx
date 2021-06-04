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

export const baseLabels: PersonContactLabelInfo[] = [
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
    label: 'Roles',
  },
  {
    key: 'isPrimary',
    label: 'Active',
    isBoolean: true,
    getValue: (data) => sentenceCase(data.isPrimary.toString()),
  },
];
