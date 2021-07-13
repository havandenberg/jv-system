import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { PeruDepartureInspectionPallet, PeruDepartureInspection } from 'types';

export type ReportLabelInfo = LabelInfo<PeruDepartureInspection>;

export const listLabels: ReportLabelInfo[] = [
  {
    key: 'inspectionDate',
    label: 'Inspection Date',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'containerId',
    label: 'Container ID',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'exporter',
    label: 'Exporter',
    filterable: true,
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'variety',
    label: 'Variety',
    filterable: true,
    sortable: true,
  },
  {
    key: 'qualityScore',
    label: 'Quality',
    sortable: true,
  },
  {
    key: 'conditionScore',
    label: 'Condition',
    sortable: true,
  },
];

export const baseLabels: ReportLabelInfo[] = [
  {
    key: 'inspectionDate',
    label: 'Inspection Date',
  },
  {
    key: 'containerId',
    label: 'Container ID',
  },
  {
    key: 'exporter',
    label: 'Exporter',
  },
  {
    key: 'variety',
    label: 'Variety',
  },
  {
    key: 'brand',
    label: 'Brand',
  },
  {
    key: 'packingDate',
    label: 'Packing Date',
  },
  {
    key: 'destination',
    label: 'Destination',
  },
  {
    key: 'packingHouse',
    label: 'Packing House',
  },
  {
    key: 'category',
    label: 'Category',
  },
  {
    key: 'presentation',
    label: 'Presentation',
  },
  {
    key: 'departureWeek',
    label: 'Departure Week',
  },
  {
    key: 'bagType',
    label: 'Vessels',
  },
  {
    key: 'packingMaterial',
    label: 'Packing Material',
  },
  {
    key: 'bagType',
    label: 'Bag Type',
  },
  {
    key: 'bagsPerBox',
    label: 'Bags / Box',
  },
];

export const getFeaturedValues = (data: PeruDepartureInspection) => [
  {
    label: 'Quality Score',
    values: [{ value: data.qualityScore }],
  },
  {
    label: 'Condition Score',
    values: [{ value: data.conditionScore }],
  },
  {
    label: 'Avg Net Weight (kg)',
    values: [{ value: data.avgNetWeight }],
  },
  {
    label: 'Avg Bunches / Box',
    values: [{ value: data.avgBunchesPerBox }],
  },
  {
    label: '°Brix',
    values: [
      { label: 'Max', value: data.brixMax },
      { label: 'Avg', value: data.brixAvg },
      { label: 'Min', value: data.brixMin },
    ],
  },
];

export type PalletLabelInfo = LabelInfo<PeruDepartureInspectionPallet>;

export const getAvgPallet = (pallets: PeruDepartureInspectionPallet[]) =>
  pallets.find((pallet) => pallet.palletId.toLowerCase() === 'average');

const getAvgData =
  (chartData: PalletLabelInfo[]) => (reportData: PeruDepartureInspection) => {
    const data = getAvgPallet(
      reportData.peruDepartureInspectionPalletsByContainerId
        .nodes as PeruDepartureInspectionPallet[],
    );
    return data
      ? chartData.map(({ key, label }) => ({ key, label, value: data[key] }))
      : [];
  };

const avgQualityLabels: PalletLabelInfo[] = [
  { key: 'stragglyTightPct', label: 'Straggly / Tight Bunches' },
  { key: 'surfaceDiscPct', label: 'Surface Discoloration' },
  { key: 'russetScarsPct', label: 'Russet / Scars' },
  { key: 'sunburnPct', label: 'Sunburn' },
  { key: 'undersizedBunchesPct', label: 'Undersized Bunches' },
  { key: 'otherDefectsPct', label: 'Other Defects' },
];

export const getAvgQualityChartLabels = getAvgData(avgQualityLabels);

const avgConditionLabels: PalletLabelInfo[] = [
  { key: 'stemDehyPct', label: 'Stem Dehydration' },
  { key: 'glassyWeakPct', label: 'Glassy / Weak' },
  { key: 'decayPct', label: 'Decay' },
  { key: 'splitCrushedPct', label: 'Split / Crushed Berries' },
  { key: 'drySplitPct', label: 'Dry Split' },
  { key: 'wetStickyPct', label: 'Wet & Sticky' },
  { key: 'waterberriesPct', label: 'Waterberries' },
  { key: 'shatterPct', label: 'Shatter' },
];

export const getAvgConditionChartData = getAvgData(avgConditionLabels);

export const tableLabels: { [key: string]: PalletLabelInfo[] } = {
  general: [
    { key: 'palletId', label: 'Pallet Number' },
    { key: 'size', label: 'Size' },
    { key: 'netWeight', label: 'Net Weight (kg)' },
    { key: 'openingScore', label: 'Opening Score' },
    { key: 'colorScore', label: 'Color Score' },
    { key: 'stemScore', label: 'Stem Score' },
    { key: 'textureScore', label: 'Berry Texture Score' },
    { key: 'bunchesPerBox', label: 'Bunches / Box' },
    { key: 'brix', label: '°Brix' },
    { key: 'totalDefectsPct', label: 'TOTAL DEFECTS (<3%)', boldColumn: true },
  ],
  qualityDefects: [
    { key: 'palletId', label: 'Pallet Number' },
    { key: 'qualityScore', label: 'Quality Score' },
    { key: 'stragglyTightPct', label: 'Straggly / Tight Bunches (0%)' },
    { key: 'surfaceDiscPct', label: 'Surface Discoloration (0%)' },
    { key: 'russetScarsPct', label: 'Russet / Scars (<5%)' },
    { key: 'sunburnPct', label: 'Sunburn (0%)' },
    { key: 'undersizedBunchesPct', label: 'Undersized Bunches (10%)' },
    { key: 'otherDefectsPct', label: 'Other Defects (%)' },
    {
      key: 'totalQualityDefectsPct',
      label: 'Total Quality Defects (%)',
      boldColumn: true,
    },
  ],
  conditionDefects: [
    { key: 'palletId', label: 'Pallet Number' },
    { key: 'conditionScore', label: 'Condition Score' },
    { key: 'stemDehyPct', label: 'Stem Dehydration (<10%)' },
    { key: 'glassyWeakPct', label: 'Glassy / Weak (0%)' },
    { key: 'decayPct', label: 'Decay (0%)' },
    { key: 'splitCrushedPct', label: 'Split / Crushed Berries (0%)' },
    { key: 'drySplitPct', label: 'Dry Split (<3%)' },
    { key: 'wetStickyPct', label: 'Wet & Sticky (0%)' },
    { key: 'waterberriesPct', label: 'Waterberries (0%)' },
    { key: 'shatterPct', label: 'Shatter (<3%)' },
    {
      key: 'totalConditionDefectsPct',
      label: 'Total Condition Defects (<3%)',
      boldColumn: true,
    },
  ],
};

export const getTableData: (selectedTabId: string) => PalletLabelInfo[] = (
  selectedTabId,
) => tableLabels[selectedTabId];
