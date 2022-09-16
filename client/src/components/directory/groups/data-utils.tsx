import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { ContactGroup } from 'types';
import ty from 'ui/typography';

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
      getValue: (data) => (
        <ty.BodyText>{!!data.userId ? 'Private' : 'Public'}</ty.BodyText>
      ),
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
    validate: ({ groupName }) => groupName.length > 0,
  },
  {
    key: 'groupDescription',
    label: 'Description',
  },
  {
    key: 'userId',
    label: userReadOnly ? 'Type' : 'Private',
    isBoolean: true,
    getValue: (data) => (
      <ty.BodyText>{!!data.userId ? 'Private' : 'Public'}</ty.BodyText>
    ),
    readOnly: userReadOnly,
  },
];
