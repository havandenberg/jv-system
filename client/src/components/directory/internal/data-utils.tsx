import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { PersonContact } from 'types';

export type PersonContactLabelInfo = LabelInfo<PersonContact>;

export const listLabels: PersonContactLabelInfo[] = [
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
    key: 'workPhone',
    label: 'Work Phone',
    transformKey: 'phone',
  },
  {
    key: 'roles',
    label: 'Roles',
  },
];

export const baseLabels: PersonContactLabelInfo[] = [
  {
    key: 'firstName',
    label: 'First Name',
  },
  {
    key: 'lastName',
    label: 'Last Name',
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
    key: 'workPhone',
    label: 'Work Phone',
    transformKey: 'phone',
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
    key: 'workExtension',
    label: 'Work Extension',
  },
  {
    key: 'preferredMethod',
    label: 'Preferred Contact Method',
  },
  {
    key: 'roles',
    label: 'Roles',
  },
];
