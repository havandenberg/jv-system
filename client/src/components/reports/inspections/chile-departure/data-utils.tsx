import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { groupBy, mapObjIndexed, pluck, sum, values } from 'ramda';
import {
  ChileDepartureInspection,
  ChileDepartureInspectionPallet,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export type ReportLabelInfo = LabelInfo<ChileDepartureInspection>;

export const listLabels: ReportLabelInfo[] = [
  {
    key: 'inspectionDate',
    label: 'Inspection Date',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.DESC,
    key: 'lotNumber',
    label: 'Lot Number',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'shipper',
    label: 'Shipper',
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

export type PalletLabelInfo = LabelInfo<ChileDepartureInspectionPallet>;

export const baseLabels: PalletLabelInfo[] = [
  {
    key: 'inspectionDate',
    label: 'Inspection Date',
  },
  {
    key: 'lotNumber',
    label: 'Lot Number',
  },
  {
    key: 'shipper',
    label: 'Shipper',
  },
  {
    key: 'variety',
    label: 'Variety',
  },
  {
    key: 'productName',
    label: 'Product',
  },
  {
    key: 'packingDate',
    label: 'Packing Date',
  },
  {
    key: 'locationName',
    label: 'Location',
  },
  {
    key: 'grower',
    label: 'Grower',
  },
  {
    key: 'packingType',
    label: 'Packing Type',
  },
  {
    key: 'label',
    label: 'Label',
  },
  {
    key: 'boxesCount',
    label: 'Number of Boxes',
  },
  {
    key: 'supervisor',
    label: 'Supervisor',
  },
  {
    key: 'productType',
    label: 'Product Type',
  },
  {
    key: 'reportLink',
    label: 'External Link',
    transformValue: (val: string) => (
      <l.Anchor href={val} target="_blank">
        View Report
      </l.Anchor>
    ),
  },
];

export const getFeaturedValues = (data: ChileDepartureInspection) => [
  {
    label: 'Quality Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.qualityScore || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Condition Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.conditionScore || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Avg Net Weight (kg)',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgNetWeight || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Avg Bunches / Box',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgBunchesCount || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: '°Brix',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'brixMax' },
            { label: 'Avg', key: 'brixAvg' },
            { label: 'Min', key: 'brixMin' },
          ] as ReportLabelInfo[]
        ).map(({ label, key }, idx) => (
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
              {data[key] || '-'}
            </ty.LargeText>
          </l.Flex>
        ))}
      </l.Div>
    ),
  },
];

export const defectsKeys: { [key: string]: string } = {
  decayPct: 'Decay',
  drySplitPct: 'Dry Split',
  glassyWeakPct: 'Glassy / Weak',
  russetScarsPct: 'Russet / Scars',
  shatterPct: 'Shatter',
  splitCrushedPct: 'Split / Crushed Berries',
  stemDehyPct: 'Stem Dehydration',
  stragglyTightPct: 'Straggly / Tight Bunches',
  sunburnPct: 'Sunburn',
  surfaceDiscPct: 'Surface Discoloration',
  undersizedBunchesPct: 'Undersized',
  waterberriesPct: 'Waterberries',
  wetStickyPct: 'Wet & Sticky',
  otherDefectsPct: 'Other Defects',
  totalConditionDefectsPct: 'Total Condition Defects',
  totalQualityDefectsPct: 'Total Quality Defects',
};

const avgKeys = [
  'color',
  'conditionScore',
  'decayPct',
  'diameterMax',
  'diameterMin',
  'drySplitPct',
  'glassyWeakPct',
  'netWeight',
  'openAppearance',
  'otherDefectsPct',
  'qualityScore',
  'russetScarsPct',
  'shatterPct',
  'splitCrushedPct',
  'stem',
  'stemDehyPct',
  'stragglyTightPct',
  'sunburnPct',
  'surfaceDiscPct',
  'temperature',
  'texture',
  'totalConditionDefectsPct',
  'totalQualityDefectsPct',
  'undersizedBunchesPct',
  'waterberriesPct',
  'wetStickyPct',
];

const avgVals: { [key: string]: string } = {
  color: '',
  openAppearance: '',
  palletNumber: 'Average',
  size: '',
};

const getAvgPalletProperty = (
  pallets: ChileDepartureInspectionPallet[],
  key: keyof ChileDepartureInspectionPallet,
) => parseFloat((sum(pluck(key, pallets)) / pallets.length).toFixed(2));

export const getAvgPallet = (pallets: ChileDepartureInspectionPallet[]) =>
  pallets.length > 0
    ? mapObjIndexed(
        (val, key: keyof ChileDepartureInspectionPallet) =>
          Object.keys(avgVals).includes(key)
            ? avgVals[key]
            : avgKeys.includes(key)
            ? getAvgPalletProperty(pallets, key)
            : val,
        pallets[0],
      )
    : undefined;

export const getChartData = (data: ChileDepartureInspectionPallet[]) =>
  values(
    mapObjIndexed(
      (group: ChileDepartureInspectionPallet[], label) => ({
        label,
        value: parseFloat(((group.length / data.length) * 100).toFixed(1)),
      }),
      groupBy((pallet) => `${pallet.scoreName}`, data),
    ),
  );

export const tableLabels: { [key: string]: PalletLabelInfo[] } = {
  general: [
    { key: 'palletNumber', label: 'Pallet Number' },
    { key: 'size', label: 'Size' },
    {
      key: 'netWeight',
      label: 'Net Weight (kg)',
      transformValue: (val: number) => (val / 1000).toFixed(2),
    },
    { key: 'openAppearance', label: 'Opening Score' },
    { key: 'color', label: 'Color Score' },
    { key: 'stem', label: 'Stem Score' },
    { key: 'texture', label: 'Berry Texture Score' },
    { key: 'bunchesCount', label: 'Bunches / Box' },
    { key: 'diameterMin', label: 'Diameter Min' },
    { key: 'diameterMax', label: 'Diameter Max' },
    // { key: 'temperature', label: 'Temperature' },
    { key: 'brix', label: '°Brix' },
  ],
  qualityDefects: [
    { key: 'palletNumber', label: 'Pallet Number' },
    { key: 'qualityScore', label: 'Quality Score' },
    { key: 'stragglyTightPct', label: 'Straggly / Tight Bunches (%)' },
    { key: 'surfaceDiscPct', label: 'Surface Discoloration (%)' },
    { key: 'russetScarsPct', label: 'Russet / Scars (%)' },
    { key: 'sunburnPct', label: 'Sunburn (%)' },
    { key: 'undersizedBunchesPct', label: 'Undersized Bunches (%)' },
    { key: 'otherDefectsPct', label: 'Other Defects (%)' },
    {
      key: 'totalQualityDefectsPct',
      label: 'Total Quality Defects (%)',
      boldColumn: true,
    },
  ],
  conditionDefects: [
    { key: 'palletNumber', label: 'Pallet Number' },
    { key: 'conditionScore', label: 'Condition Score' },
    { key: 'stemDehyPct', label: 'Stem Dehydration (%)' },
    { key: 'glassyWeakPct', label: 'Glassy / Weak (%)' },
    { key: 'decayPct', label: 'Decay (%)' },
    { key: 'splitCrushedPct', label: 'Split / Crushed Berries (%)' },
    { key: 'drySplitPct', label: 'Dry Split (%)' },
    { key: 'wetStickyPct', label: 'Wet & Sticky (%)' },
    { key: 'waterberriesPct', label: 'Waterberries (%)' },
    { key: 'shatterPct', label: 'Shatter (%)' },
    {
      key: 'totalConditionDefectsPct',
      label: 'Total Condition Defects (%)',
      boldColumn: true,
    },
  ],
};

export const getTableData: (selectedTabId: string) => PalletLabelInfo[] = (
  selectedTabId,
) => tableLabels[selectedTabId];
