import { REPACK_STYLE_DISTINCT_VALUES_QUERY } from 'api/inventory/repacks';
import { WAREHOUSE_DISTINCT_VALUES_QUERY } from 'api/directory/warehouse';
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
    filterPanelProps: {
      customStyles: {
        width: 500,
      },
      queryProps: {
        query: WAREHOUSE_DISTINCT_VALUES_QUERY,
        queryName: 'warehouseDistinctValues',
      },
      showSearch: true,
    },
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
    filterPanelProps: {
      customStyles: {
        left: -234,
        width: 500,
      },
      queryProps: {
        query: REPACK_STYLE_DISTINCT_VALUES_QUERY,
        queryName: 'repackStyleDistinctValues',
      },
      showSearch: true,
    },
    getValue: ({ repackStyle }) =>
      repackStyle ? (
        <ty.BodyText>{repackStyle.styleDescription}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'boxesIn',
    label: 'Boxes Out/In (lbs)',
    sortable: true,
    customSortBy: ({ boxesIn, boxesOut }) => {
      const boxesInNum = parseInt(boxesIn, 10);
      const boxesOutNum = parseInt(boxesOut, 10);
      return (
        <ty.BodyText>
          {boxesInNum && boxesOutNum ? boxesInNum / boxesOutNum : 0}
        </ty.BodyText>
      );
    },
    getValue: ({ boxesIn, boxesOut }) => {
      const boxesInNum = parseInt(boxesIn, 10);
      const boxesOutNum = parseInt(boxesOut, 10);
      return (
        <ty.BodyText>
          {boxesInNum && boxesOutNum
            ? ((boxesInNum / boxesOutNum) * 100).toFixed(1)
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'weightIn',
    label: 'Weight Out/In (lbs)',
    sortable: true,
    customSortBy: ({ weightIn, weightOut }) => {
      const weightInNum = parseFloat(weightIn);
      const weightOutNum = parseFloat(weightOut);
      return (
        <ty.BodyText>
          {weightInNum && weightOutNum ? weightOutNum / weightInNum : 0}
        </ty.BodyText>
      );
    },
    getValue: ({ weightIn, weightOut }) => {
      const weightInNum = parseFloat(weightIn);
      const weightOutNum = parseFloat(weightOut);
      return (
        <ty.BodyText>
          {weightInNum && weightOutNum
            ? ((weightOutNum / weightInNum) * 100).toFixed(1)
            : '-'}
        </ty.BodyText>
      );
    },
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
      repackStyle?.commonPackType?.commonSpecies?.id ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/products/${repackStyle?.commonPackType?.commonSpecies?.id}/pack-types/${repackStyle?.commonPackType?.id}`}
        >
          {repackStyle.styleDescription}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{repackStyle?.styleDescription || '-'}</ty.BodyText>
      ),
  },
];

export const baseLabels: RepackHeaderLabelInfo[] = [
  {
    key: 'runNumber',
    label: 'Run Number',
  },
  {
    key: 'boxesIn',
    label: 'Boxes In',
  },
  {
    key: 'boxesOut',
    label: 'Boxes Out',
  },
  {
    key: 'weightIn',
    label: 'Weight In (lbs)',
  },
  {
    key: 'weightOut',
    label: 'Weight Out (lbs)',
  },
  {
    key: 'entryUserCode',
    label: 'Entered By',
  },
  {
    key: 'whBoxesIn',
    label: 'WH Boxes In',
  },
  {
    key: 'whBoxesOut',
    label: 'WH Boxes Out',
  },
  {
    key: 'whWeightIn',
    label: 'WH Weight In (lbs)',
  },
  {
    key: 'whWeightOut',
    label: 'WH Weight Out (lbs)',
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];
