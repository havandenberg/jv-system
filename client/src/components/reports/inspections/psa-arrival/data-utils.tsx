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

export const getFeaturedValues = (data: PsaArrivalReport) => [
  {
    label: 'Quality Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgGrapeQuality || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: ' Condition Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgGrapeCondition || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Avg Net Weight (kg)',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.avgGrapeNetWeight || '-'}
      </ty.HugeText>
    ),
  },
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
