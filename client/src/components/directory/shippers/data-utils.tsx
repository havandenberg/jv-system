import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { Shipper } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';

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
    readOnly: true,
  },
  {
    key: 'shipperName',
    label: 'Shipper Name',
  },
  {
    key: 'countryId',
    label: 'Country',
    getValue: (data) => data.country?.countryName || '',
    readOnly: true,
  },
  {
    key: 'groupId',
    label: 'Group ID',
  },
  {
    key: 'notes',
    label: 'Notes',
  },
  {
    key: 'sendProjectionRequest',
    label: 'Send Projection Request',
    isBoolean: true,
    getValue: (data) =>
      !!data.sendProjectionRequest ? (
        <LineItemCheckbox checked={true} disabled onChange={() => ({})} />
      ) : (
        <LineItemCheckbox checked={false} disabled onChange={() => ({})} />
      ),
  },
  {
    key: 'projectionRequestStartDate',
    label: 'Projections Start Date',
    isDate: true,
  },
  {
    key: 'projectionRequestEndDate',
    label: 'Projections End Date',
    isDate: true,
  },
];
