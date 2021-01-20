import { Pallet, PeruInspectionReport } from 'types/inspections';

export const getAvgPallet = (pallets: Pallet[]) =>
  pallets.find((pallet) => pallet.id === 'average');

export interface ChartData {
  key: keyof Pallet;
  label: string;
}

const getAvgData = (chartData: ChartData[]) => (
  reportData: PeruInspectionReport,
) => {
  const data = getAvgPallet(reportData.pallets);
  return data
    ? chartData.map(({ key, label }) => ({ key, label, value: data[key] }))
    : [];
};

const avgQualityData: ChartData[] = [
  { key: 'stragglyTightPct', label: 'Straggly / Tight Bunches' },
  { key: 'surfaceDiscPct', label: 'Surface Discoloration' },
  { key: 'russetScarsPct', label: 'Russet / Scars' },
  { key: 'sunburnPct', label: 'Sunburn' },
  { key: 'undersizedBunchesPct', label: 'Undersized Bunches' },
  { key: 'othersDefectsPct', label: 'Others Defects' },
];

export const getAvgQualityChartData = getAvgData(avgQualityData);

const avgConditionData: ChartData[] = [
  { key: 'stemDehyPct', label: 'Stem Dehydration' },
  { key: 'glassyWeakPct', label: 'Glassy / Weak' },
  { key: 'decayPct', label: 'Decay' },
  { key: 'splitCrushedPct', label: 'Split / Crushed Berries' },
  { key: 'drySplitPct', label: 'Dry Split' },
  { key: 'wetStickyPct', label: 'Wet & Sticky' },
  { key: 'waterberriesPct', label: 'Waterberries' },
  { key: 'shatterPct', label: 'Shatter' },
];

export const getAvgConditionChartData = getAvgData(avgConditionData);
