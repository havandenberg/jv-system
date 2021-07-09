import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { PsaArrivalReport } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export type ReportLabelInfo = LabelInfo<PsaArrivalReport>;

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
    key: 'avgQuality',
    label: 'Quality',
    sortable: true,
    getValue: (data) => data.avgQuality || '-',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'avgCondition',
    label: 'Condition',
    sortable: true,
    getValue: (data) => data.avgCondition || '-',
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

export const commonFeaturedValues = (data: PsaArrivalReport) => [
  {
    label: 'Quality Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgQualityByVariety || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Condition Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgConditionByVariety || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Avg Weight (kg)',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgNetWeight || '-'}
      </ty.HugeText>
    ),
  },
];

export const getGrapeFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: 'Bunches / Box',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgGrapeBunchesPerBox || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: '°Brix',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgGrapeBrixMax' },
            { label: 'Min', key: 'avgGrapeBrixMin' },
            { label: 'Most', key: 'avgGrapeBrixMost' },
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

export const getCitrusFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: '°Brix',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgBrix || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Diameter (mm)',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgCitrusDiameterMaxMm' },
            { label: 'Min', key: 'avgCitrusDiameterMinMm' },
            { label: 'Most', key: 'avgCitrusDiameterMostMm' },
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

export const getStoneFruitFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: '°Brix',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgBrix || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Pressures',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgStoneFruitPressuresMax' },
            { label: 'Min', key: 'avgStoneFruitPressuresMin' },
            { label: 'Avg', key: 'avgStoneFruitPressuresAvg' },
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

export const getPomegranateFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: '°Brix',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgPomegranateBrixMax' },
            { label: 'Min', key: 'avgPomegranateBrixMin' },
            { label: 'Most', key: 'avgPomegranateBrixMost' },
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

export const getPersimmonFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: '°Brix',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgBrix || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Pressures',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgPersimmonPressuresMax' },
            { label: 'Min', key: 'avgPersimmonPressuresMin' },
            { label: 'Avg', key: 'avgPersimmonPressuresAvg' },
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

export const getPearFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: 'Pressures',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgPearPressuresMax' },
            { label: 'Min', key: 'avgPearPressuresMin' },
            { label: 'Avg', key: 'avgPearPressuresAvg' },
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

export const getLemonFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: 'Diameter (mm)',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgLemonDiameterMaxMm' },
            { label: 'Min', key: 'avgLemonDiameterMinMm' },
            { label: 'Most', key: 'avgLemonDiameterMostMm' },
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

export const getCherryFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: 'Size',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgCherrySizeMax' },
            { label: 'Min', key: 'avgCherrySizeMin' },
            { label: 'Most', key: 'avgCherrySizeMost' },
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

export const getAppleFeaturedValues = (data: PsaArrivalReport) => [
  ...commonFeaturedValues(data),
  {
    label: 'Pressures',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'avgApplePressuresMax' },
            { label: 'Min', key: 'avgApplePressuresMin' },
            { label: 'Avg', key: 'avgApplePressuresAvg' },
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
