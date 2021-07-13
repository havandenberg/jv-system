import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { ContactGroup } from 'types';

export type ContactGroupLabelInfo = LabelInfo<ContactGroup>;

export const listLabels: (hasUser: boolean) => ContactGroupLabelInfo[] = (
  hasUser,
) => {
  const userLabels: ContactGroupLabelInfo[] = [];
  if (hasUser) {
    userLabels.push({
      key: 'userId',
      label: 'Type',
      isBoolean: true,
      getValue: (data) => (!!data.userId ? 'Private' : 'Public'),
    });
  }
  return [
    {
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'groupName',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'groupDescription',
      label: 'Description',
    },
    ...userLabels,
  ];
};

export const baseLabels: (userReadOnly: boolean) => ContactGroupLabelInfo[] = (
  userReadOnly,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'groupName',
    label: 'Name',
    sortable: true,
    validate: (val) => val.length > 0,
  },
  {
    key: 'groupDescription',
    label: 'Description',
  },
  {
    key: 'userId',
    label: userReadOnly ? 'Type' : 'Private',
    isBoolean: true,
    getValue: (data) => (!!data.userId ? 'Private' : 'Public'),
    readOnly: userReadOnly,
  },
];
