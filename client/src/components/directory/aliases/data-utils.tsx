import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { ContactAlias } from 'types';

export type ContactAliasLabelInfo = LabelInfo<ContactAlias>;

export const listLabels: ContactAliasLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'aliasName',
    label: 'Name',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'aliasType',
    label: 'Type',
    sortable: true,
  },
  {
    key: 'aliasDescription',
    label: 'Description',
  },
];

export const baseLabels: ContactAliasLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'aliasName',
    label: 'Name',
    sortable: true,
    validate: (val) => val.length > 0,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'aliasType',
    label: 'Type',
    sortable: true,
    validate: (val) => val.length > 0,
  },
  {
    key: 'aliasDescription',
    label: 'Description',
  },
];
