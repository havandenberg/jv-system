import { sentenceCase } from 'change-case';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { ContactAlias } from 'types';

export type ContactAliasLabelInfo = LabelInfo<ContactAlias>;

export const listLabels: (hasUser: boolean) => ContactAliasLabelInfo[] = (
  hasUser,
) => {
  const userLabels: ContactAliasLabelInfo[] = [];
  if (hasUser) {
    userLabels.push({
      key: 'userId',
      label: 'Private',
      isBoolean: true,
      getValue: (data) => sentenceCase((!!data.userId).toString()),
    });
  }
  return [
    {
      defaultSortOrder: SORT_ORDER.ASC,
      key: 'aliasName',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'aliasDescription',
      label: 'Description',
    },
    ...userLabels,
  ];
};

export const baseLabels: (userReadOnly: boolean) => ContactAliasLabelInfo[] = (
  userReadOnly,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'aliasName',
    label: 'Name',
    sortable: true,
    validate: (val) => val.length > 0,
  },
  {
    key: 'aliasDescription',
    label: 'Description',
  },
  {
    key: 'userId',
    label: 'Private',
    isBoolean: true,
    getValue: (data) => sentenceCase((!!data.userId).toString()),
    readOnly: userReadOnly,
  },
];
