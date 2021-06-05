import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { PsaArrivalReport } from 'types';

export type ReportLabelInfo = LabelInfo<PsaArrivalReport>;

export const listLabels: ReportLabelInfo[] = [
  {
    key: 'reportDate',
    label: 'Inspection Date',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'exporterName',
    label: 'Exporter',
    filterable: true,
    filterPanelProps: {
      customStyles: {
        width: 350,
      },
      showSearch: true,
    },
    sortable: true,
    getValue: (data) => `${data.exporterName} (${data.exporterId})`,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'arrivalName',
    label: 'Vessel',
    filterable: true,
    filterPanelProps: {
      customStyles: {
        width: 350,
      },
      showSearch: true,
    },
    sortable: true,
    getValue: (data) => `${data.arrivalName} (${data.arrivalCode})`,
  },
  {
    key: 'locationName',
    label: 'Location',
    filterable: true,
  },
];

export const baseLabels: ReportLabelInfo[] = [
  {
    key: 'reportDate',
    label: 'Inspection Date',
  },
  {
    key: 'id',
    label: 'Report ID',
  },
  {
    key: 'exporterId',
    label: 'Exporter Code',
  },
  {
    key: 'exporterName',
    label: 'Exporter Name',
  },
  {
    key: 'locationName',
    label: 'Location Name',
  },
  {
    key: 'arrivalCode',
    label: 'Vessel Code',
  },
  {
    key: 'arrivalName',
    label: 'Vessel Name',
  },
];
