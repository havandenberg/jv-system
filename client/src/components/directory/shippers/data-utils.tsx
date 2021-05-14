import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Shipper } from 'types';

export type ShipperLabelInfo = LabelInfo<Shipper>;

export const listLabels: ShipperLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'shipperName',
    label: 'Shipper Name',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'countryId',
    label: 'Country',
    filterPanelProps: { columnCount: 3 },
    filterable: true,
    sortable: true,
    getValue: (data) => data.country?.countryName || '',
  },
  {
    key: 'groupId',
    label: 'Group ID',
  },
];

export const baseLabels: ShipperLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'shipperName',
    label: 'Shipper Name',
  },
  {
    key: 'countryId',
    label: 'Country',
    getValue: (data) => data.country?.countryName || '',
  },
  {
    key: 'groupId',
    label: 'Group ID',
  },
  {
    key: 'notes',
    label: 'Notes',
    transformKey: 'link',
  },
  {
    key: 'website',
    label: 'Website',
    transformKey: 'link',
  },
];
