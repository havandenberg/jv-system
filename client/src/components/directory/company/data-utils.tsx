import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Company } from 'types';

export type CompanyLabelInfo = LabelInfo<Company>;

export const listLabels: CompanyLabelInfo[] = [
  {
    key: 'logoSrc',
    label: 'Logo',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'companyName',
    label: 'Company Name',
    sortable: true,
  },
  {
    key: 'primaryContact',
    label: 'Primary Contact',
    getValue: (data) => data.primaryContact?.contactName || '',
  },
  {
    key: 'website',
    label: 'Website',
    transformKey: 'link',
  },
];

export const baseLabels: CompanyLabelInfo[] = [
  {
    key: 'logoSrc',
    label: 'Logo',
  },
  {
    key: 'companyName',
    label: 'Company Name',
  },
  {
    key: 'primaryContact',
    label: 'Primary Contact',
    getValue: (data) => {
      console.log(data.primaryContact?.contactName || '');
      return data.primaryContact?.contactName || '';
    },
  },
  {
    key: 'website',
    label: 'Website',
    transformKey: 'link',
  },
];
