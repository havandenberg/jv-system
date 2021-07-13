import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { mean, pluck } from 'ramda';
import { PsaArrivalReport } from 'types';

export type ReportLabelInfo = LabelInfo<PsaArrivalReport>;

const getRangeValue = (range: string) => {
  const values = range.split('-');
  return values.length > 1 && values[0] === values[1] ? range[0] : range;
};

export const listLabels: ReportLabelInfo[] = [
  {
    key: 'reportDate',
    label: 'Report Date',
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
    getValue: (data) =>
      data.locationName === 'PSA-USEC'
        ? 'EC'
        : data.locationName === 'PSA-USWC'
        ? 'WC'
        : data.locationName,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'qualityRange',
    label: 'Quality',
    sortable: true,
    getValue: (data) =>
      data.qualityRange ? getRangeValue(data.qualityRange) : '-',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'conditionRange',
    label: 'Condition',
    sortable: true,
    getValue: (data) =>
      data.conditionRange ? getRangeValue(data.conditionRange) : '-',
  },
];

export const baseLabels: ReportLabelInfo[] = [
  {
    key: 'reportDate',
    label: 'Report Date',
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

interface PalletFilters {
  size: string;
  growerCode: string;
  labelCode: string;
  overallQuality: string;
  overallCondition: string;
}

export const filterPallets = (pallets: any[], filters: PalletFilters) =>
  pallets.filter(
    (p) =>
      (!filters.size || filters.size.split(',').includes(p.size)) &&
      (!filters.growerCode ||
        filters.growerCode.split(',').includes(p.growerCode)) &&
      (!filters.labelCode ||
        filters.labelCode.split(',').includes(p.labelCode)) &&
      (!filters.overallQuality ||
        filters.overallQuality.split(',').includes(p.overallQuality)) &&
      (!filters.overallCondition ||
        filters.overallCondition.split(',').includes(p.overallCondition)),
  );

export const getPallets = (data: PsaArrivalReport): any[] => {
  if (data.grapePallets.nodes.length > 0) {
    return data.grapePallets.nodes;
  }
  if (data.citrusPallets.nodes.length > 0) {
    return data.citrusPallets.nodes;
  }
  if (data.stoneFruitPallets.nodes.length > 0) {
    return data.stoneFruitPallets.nodes;
  }
  if (data.pomegranatePallets.nodes.length > 0) {
    return data.pomegranatePallets.nodes;
  }
  if (data.persimmonPallets.nodes.length > 0) {
    return data.persimmonPallets.nodes;
  }
  if (data.pearPallets.nodes.length > 0) {
    return data.pearPallets.nodes;
  }
  if (data.lemonPallets.nodes.length > 0) {
    return data.lemonPallets.nodes;
  }
  if (data.cherryPallets.nodes.length > 0) {
    return data.cherryPallets.nodes;
  }
  if (data.applePallets.nodes.length > 0) {
    return data.applePallets.nodes;
  }
  return [];
};

const getPalletMean = (pallets: any[], key: any) => {
  const value = mean(
    pluck(key, pallets)
      .filter((n) => !!n)
      .map((n) => n && parseFloat(n as string)),
  );
  return `${value ? +value.toFixed(1) : '-'}`;
};

const commonFeaturedValues = (pallets: any[]) => {
  const getPalletValuePercentage = (values: any[], key: any) =>
    `${
      +(
        (pallets.filter((p) => values.includes(p[key])).length /
          pallets.length) *
        100
      ).toFixed(1) || '-'
    }`;

  return [
    {
      label: 'Quality %',
      values: [
        {
          label: '1-2',
          value: getPalletValuePercentage(['1', '2'], 'overallQuality'),
        },
        {
          label: '3-4',
          value: getPalletValuePercentage(['3', '4'], 'overallQuality'),
        },
        {
          label: '5-7',
          value: getPalletValuePercentage(['5', '6', '7'], 'overallQuality'),
        },
      ],
    },
    {
      label: 'Condition %',
      values: [
        {
          label: '1-2',
          value: getPalletValuePercentage(['1', '2'], 'overallCondition'),
        },
        {
          label: '3-4',
          value: getPalletValuePercentage(['3', '4'], 'overallCondition'),
        },
        {
          label: '5-7',
          value: getPalletValuePercentage(['5', '6', '7'], 'overallCondition'),
        },
      ],
    },
    {
      label: 'Avg Weight (kg)',
      values: [
        {
          value: getPalletMean(pallets, 'weight'),
        },
      ],
    },
  ];
};

export const getCommonFeaturedValues = (pallets: any[]) =>
  commonFeaturedValues(pallets);

export const getGrapeFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: 'Bunches / Box',
    values: [{ value: getPalletMean(pallets, 'bunches') }],
  },
  {
    label: '°Brix',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'brixMax') },
      { label: 'Min', value: getPalletMean(pallets, 'brixMin') },
      { label: 'Most', value: getPalletMean(pallets, 'brixMost') },
    ],
  },
];

export const getCitrusFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: '°Brix',
    values: [{ value: getPalletMean(pallets, 'brix') }],
  },
  {
    label: 'Diameter (mm)',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'diameterMaxMm') },
      { label: 'Min', value: getPalletMean(pallets, 'diameterMinMm') },
      { label: 'Most', value: getPalletMean(pallets, 'diameterMostMm') },
    ],
  },
];

export const getStoneFruitFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: '°Brix',
    values: [{ value: getPalletMean(pallets, 'brix') }],
  },
  {
    label: 'Pressures',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'pressuresMax') },
      { label: 'Min', value: getPalletMean(pallets, 'pressuresMin') },
      { label: 'Avg', value: getPalletMean(pallets, 'pressuresAvg') },
    ],
  },
];

export const getPomegranateFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: '°Brix',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'brixMax') },
      { label: 'Min', value: getPalletMean(pallets, 'brixMin') },
      { label: 'Most', value: getPalletMean(pallets, 'brixMost') },
    ],
  },
];

export const getPersimmonFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: '°Brix',
    values: [{ value: getPalletMean(pallets, 'brix') }],
  },
  {
    label: 'Pressures',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'pressuresMax') },
      { label: 'Min', value: getPalletMean(pallets, 'pressuresMin') },
      { label: 'Avg', value: getPalletMean(pallets, 'pressuresAvg') },
    ],
  },
];

export const getPearFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: 'Pressures',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'pressuresMax') },
      { label: 'Min', value: getPalletMean(pallets, 'pressuresMin') },
      { label: 'Avg', value: getPalletMean(pallets, 'pressuresAvg') },
    ],
  },
];

export const getLemonFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: 'Diameter (mm)',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'diameterMaxMm') },
      { label: 'Min', value: getPalletMean(pallets, 'diameterMinMm') },
      { label: 'Most', value: getPalletMean(pallets, 'diameterMostMm') },
    ],
  },
];

export const getCherryFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: 'Size',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'sizeMax') },
      { label: 'Min', value: getPalletMean(pallets, 'sizeMin') },
      { label: 'Most', value: getPalletMean(pallets, 'sizeMost') },
    ],
  },
];

export const getAppleFeaturedValues = (pallets: any[]) => [
  ...commonFeaturedValues(pallets),
  {
    label: 'Pressures',
    values: [
      { label: 'Max', value: getPalletMean(pallets, 'pressuresMax') },
      { label: 'Min', value: getPalletMean(pallets, 'pressuresMin') },
      { label: 'Avg', value: getPalletMean(pallets, 'pressuresAvg') },
    ],
  },
];
