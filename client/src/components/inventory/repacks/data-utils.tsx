import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { RepackHeader } from 'types';
import ty from 'ui/typography';

export type RepackHeaderLabelInfo = LabelInfo<RepackHeader>;

export const indexListLabels: RepackHeaderLabelInfo[] = [
  {
    key: 'repackDate',
    label: 'Repack Date',
    isDate: true,
    sortable: true,
  },
  {
    key: 'repackCode',
    label: 'Code',
  },
  {
    key: 'warehouseId',
    label: 'Warehouse',
    filterable: true,
    sortable: true,
    getValue: ({ warehouse }) =>
      warehouse ? (
        <ty.LinkText
          hover="false"
          to={`/directory/warehouses/${warehouse?.id}`}
        >
          {warehouse.id} - {warehouse.warehouseName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'repackStyleId',
    label: 'Repack Style',
    sortable: true,
    filterable: true,
    getValue: ({ repackStyle }) =>
      repackStyle ? <ty.BodyText>{repackStyle.styleName}</ty.BodyText> : '',
  },
];

export const listLabels: RepackHeaderLabelInfo[] = [
  {
    key: 'runNumber',
    label: 'Run Number',
    sortable: true,
    defaultSortOrder: SORT_ORDER.ASC,
  },
];

export const indexBaseLabels: RepackHeaderLabelInfo[] = [
  {
    key: 'repackDate',
    label: 'Repack Date',
    isDate: true,
    sortable: true,
  },
  {
    key: 'repackCode',
    label: 'Code',
  },
  {
    key: 'warehouseId',
    label: 'Warehouse',
    getValue: ({ warehouse }) =>
      warehouse ? (
        <ty.LinkText
          hover="false"
          to={`/directory/warehouses/${warehouse?.id}`}
        >
          {warehouse.id} - {warehouse.warehouseName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'repackStyleId',
    label: 'Repack Style',
    getValue: ({ repackStyle }) =>
      repackStyle ? <ty.BodyText>{repackStyle.styleName}</ty.BodyText> : '',
  },
];

export const baseLabels: RepackHeaderLabelInfo[] = [
  {
    key: 'runNumber',
    label: 'Run Number',
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];
