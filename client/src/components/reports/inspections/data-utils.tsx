import { contains, omit, reduce, values } from 'ramda';

import { Tab } from 'components/tab-bar';
import {
  Pallet,
  PeruInspectionReport,
} from 'components/reports/inspections/types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface LabelInfo<T> {
  key: keyof T;
  label: string;
}

export type ReportLabelInfo = LabelInfo<PeruInspectionReport>;

export const listLabels: ReportLabelInfo[] = [
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
    key: 'qualityScore',
    label: 'Quality',
  },
  {
    key: 'conditionScore',
    label: 'Condition',
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

export const getFeaturedValues = (data: PeruInspectionReport) => [
  {
    label: 'Quality Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.qualityScore}
      </ty.HugeText>
    ),
  },
  {
    label: 'Condition Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.conditionScore}
      </ty.HugeText>
    ),
  },
  {
    label: 'Avg Net Weight (kg)',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgNetWeight}
      </ty.HugeText>
    ),
  },
  {
    label: 'Avg Bunches / Box',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgBunchesPerBox}
      </ty.HugeText>
    ),
  },
  {
    label: '°Brix',
    value: (
      <l.Div width={th.sizes.fill}>
        {([
          { label: 'Max', key: 'brixMax' },
          { label: 'Avg', key: 'brixAvg' },
          { label: 'Min', key: 'brixMin' },
        ] as ReportLabelInfo[]).map(({ label, key }, idx) => (
          <l.Flex
            alignCenter
            justifyBetween
            key={idx}
            mb={th.spacing.xs}
            mx={th.spacing.sm}
          >
            <ty.CaptionText inverted secondary>
              {label}
            </ty.CaptionText>
            <ty.LargeText inverted my={0}>
              {data[key]}
            </ty.LargeText>
          </l.Flex>
        ))}
      </l.Div>
    ),
  },
];

export type PalletLabelInfo = LabelInfo<Pallet>;

export const getAvgPallet = (pallets: Pallet[]) =>
  pallets.find((pallet) => pallet.id === 'average');

const getAvgData = (chartData: PalletLabelInfo[]) => (
  reportData: PeruInspectionReport,
) => {
  const data = getAvgPallet(reportData.pallets);
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

export const tableTabs: Tab[] = [
  {
    id: 'general',
    text: 'General',
  },
  {
    id: 'qualityDefects',
    text: 'Quality Defects',
  },
  {
    id: 'conditionDefects',
    text: 'Condition Defects',
  },
];

export const tableLabels: { [key: string]: PalletLabelInfo[] } = {
  general: [
    { key: 'id', label: 'Pallet Number' },
    { key: 'size', label: 'Size' },
    { key: 'netWeight', label: 'Net Weight (kg)' },
    { key: 'openingScore', label: 'Opening Score' },
    { key: 'colorScore', label: 'Color Score' },
    { key: 'stemScore', label: 'Stem Score' },
    { key: 'textureScore', label: 'Berry Texture Score' },
    { key: 'bunchesPerBox', label: 'Bunches / Box' },
    { key: 'brix', label: '°Brix' },
    { key: 'qualityScore', label: 'Quality Score' },
    { key: 'conditionScore', label: 'Condition Score' },
    { key: 'totalQualityDefectsPct', label: 'Total Quality Defects (%)' },
    {
      key: 'totalConditionDefectsPct',
      label: 'Total Condition Defects (<3%)',
    },
    { key: 'totalDefectsPct', label: 'TOTAL DEFECTS (<3%)' },
  ],
  qualityDefects: [
    { key: 'id', label: 'Pallet Number' },
    { key: 'stragglyTightPct', label: 'Straggly / Tight Bunches (0%)' },
    { key: 'surfaceDiscPct', label: 'Surface Discoloration (0%)' },
    { key: 'russetScarsPct', label: 'Russet / Scars (<5%)' },
    { key: 'sunburnPct', label: 'Sunburn (0%)' },
    { key: 'undersizedBunchesPct', label: 'Undersized Bunches (10%)' },
    { key: 'otherDefectsPct', label: 'Other Defects (%)' },
    { key: 'totalQualityDefectsPct', label: 'Total Quality Defects (%)' },
  ],
  conditionDefects: [
    { key: 'id', label: 'Pallet Number' },
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
    },
  ],
};

export const getTableData: (selectedTabId: string) => PalletLabelInfo[] = (
  selectedTabId,
) => tableLabels[selectedTabId];

export const filterInspectionReports = (
  reports: PeruInspectionReport[],
  search: string,
  startDate?: Date,
  endDate?: Date,
) =>
  reports.filter((report) =>
    reduce(
      (containsSearch: boolean, value: string) =>
        containsSearch || contains(search.toLowerCase(), value.toLowerCase()),
      false,
      values(omit(['pallets'], report)).map((value) => `${value}`),
    ),
  );

export const sortInspectionReports = (
  sortOption: keyof PeruInspectionReport,
  reports: PeruInspectionReport[],
) => reports;
