import { mapObjIndexed, pathOr } from 'ramda';
import XLSX from 'xlsx';

import { formatDate } from 'components/date-range-picker';
import { Tab } from 'components/tab-bar';
import { SortOrder, SORT_ORDER } from 'hooks/use-columns';
import { PeruDepartureInspectionPallet, PeruDepartureInspection } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export interface LabelInfo<T> {
  defaultSortOrder?: SortOrder;
  filterable?: boolean;
  key: keyof T;
  label: string;
}

export type ReportLabelInfo = LabelInfo<PeruDepartureInspection>;

export const listLabels: ReportLabelInfo[] = [
  {
    key: 'inspectionDate',
    label: 'Inspection Date',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'containerId',
    label: 'Container ID',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'exporter',
    label: 'Exporter',
    filterable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'variety',
    label: 'Variety',
    filterable: true,
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

export const getFeaturedValues = (data: PeruDepartureInspection) => [
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

export type PalletLabelInfo = LabelInfo<PeruDepartureInspectionPallet>;

export const getAvgPallet = (pallets: PeruDepartureInspectionPallet[]) =>
  pallets.find((pallet) => pallet.palletId.toLowerCase() === 'average');

const getAvgData = (chartData: PalletLabelInfo[]) => (
  reportData: PeruDepartureInspection,
) => {
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
    { key: 'palletId', label: 'Pallet Number' },
    { key: 'size', label: 'Size' },
    { key: 'netWeight', label: 'Net Weight (kg)' },
    { key: 'openingScore', label: 'opening Score' },
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
    { key: 'palletId', label: 'Pallet Number' },
    { key: 'stragglyTightPct', label: 'Straggly / Tight Bunches (0%)' },
    { key: 'surfaceDiscPct', label: 'Surface Discoloration (0%)' },
    { key: 'russetScarsPct', label: 'Russet / Scars (<5%)' },
    { key: 'sunburnPct', label: 'Sunburn (0%)' },
    { key: 'undersizedBunchesPct', label: 'Undersized Bunches (10%)' },
    { key: 'otherDefectsPct', label: 'Other Defects (%)' },
    { key: 'totalQualityDefectsPct', label: 'Total Quality Defects (%)' },
  ],
  conditionDefects: [
    { key: 'palletId', label: 'Pallet Number' },
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

const emptyPallet = {
  palletId: '',
  size: '',
  netWeight: 0,
  openingScore: 0,
  colorScore: 0,
  stemScore: 0,
  textureScore: 0,
  bunchesPerBox: 0,
  brix: 0,
  qualityScore: 0,
  conditionScore: 0,
  stragglyTightPct: 0,
  surfaceDiscPct: 0,
  russetScarsPct: 0,
  sunburnPct: 0,
  undersizedBunchesPct: 0,
  otherDefectsPct: 0,
  totalQualityDefectsPct: 0,
  stemDehyPct: 0,
  glassyWeakPct: 0,
  decayPct: 0,
  splitCrushedPct: 0,
  drySplitPct: 0,
  wetStickyPct: 0,
  waterberriesPct: 0,
  shatterPct: 0,
  totalConditionDefectsPct: 0,
  totalDefectsPct: 0,
};

export const validateDataFile = (file: XLSX.WorkBook) =>
  file.SheetNames.length === 3 && file.SheetNames[2] === 'QC';

export const parseDataFile = (file: XLSX.WorkBook) => {
  const sheetData = file.Sheets[file.SheetNames[2]];
  var stream = XLSX.utils.sheet_to_csv(sheetData, {
    blankrows: false,
    skipHidden: true,
    strip: true,
  });
  const dataArray = stream
    .split('\n')
    .filter((row) => row.length > 0)
    .map((row) =>
      row
        .split(',')
        .map((cell) => cell.trim())
        .filter((val) => val),
    );
  let lastPalletIndex = -1;
  dataArray.forEach((val: string[], index: number) => {
    if (val[0] === 'QC Comments:') {
      lastPalletIndex = index;
    }
  });
  const data = {
    avgBunchesPerBox: parseFloat(pathOr('', [-3, 3], dataArray)),
    avgNetWeight: parseFloat(pathOr('', [-3, 2], dataArray)),
    bagsPerBox: parseFloat(pathOr('', [4, 5], dataArray)),
    bagType: '',
    brand: pathOr('', [2, 3], dataArray),
    brixMax: parseFloat(pathOr('', [-3, 5], dataArray)),
    brixAvg: parseFloat(pathOr('', [-2, 1], dataArray)),
    brixMin: parseFloat(pathOr('', [-1, 1], dataArray)),
    category: pathOr('', [3, 3], dataArray),
    comments: pathOr('', [lastPalletIndex, 1], dataArray),
    conditionScore: parseFloat(pathOr('', [-3, 1], dataArray)),
    containerId: pathOr('', [5, 1], dataArray),
    destination: pathOr('', [3, 1], dataArray),
    departureWeek: pathOr('', [4, 2], dataArray),
    exporter: pathOr('', [1, 1], dataArray),
    inspectionDate: formatDate(new Date(pathOr('', [5, -1], dataArray))),
    packingDate: formatDate(new Date(pathOr('', [4, 1], dataArray))),
    packingHouse: pathOr('', [2, 1], dataArray),
    packingMaterial: pathOr('', [4, 4], dataArray),
    presentation: pathOr('', [3, 4], dataArray),
    qualityScore: parseFloat(pathOr('', [-3, 0], dataArray)),
    variety: pathOr('', [1, 3], dataArray),
    peruDepartureInspectionPalletsUsingContainerId: {
      create: dataArray.slice(7, lastPalletIndex).map((val: string[]) =>
        mapObjIndexed((v, key) => {
          const isAverage = val[0].toLowerCase() === 'average';
          if (isAverage && key === 'size') {
            return '';
          }
          const modifyIndex = isAverage && !['palletId', 'size'].includes(key);
          const index =
            Object.keys(emptyPallet).indexOf(key) + (modifyIndex ? -1 : 0);
          return index > (modifyIndex ? 0 : 1)
            ? parseFloat(val[index])
            : val[index];
        }, emptyPallet),
      ),
    },
  };
  return data;
};
