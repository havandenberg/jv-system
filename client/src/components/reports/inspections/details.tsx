import React from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';

import { API_BASE } from 'api';
import { useInspections } from 'api/inspections';
import Page from 'components/page';
import ValuePanel from 'components/value-panel';
import useLightbox from 'hooks/use-lightbox';
import { PeruInspectionReport } from 'types/inspections';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const breadcrumbs = (id: string) => [
  { text: 'All Inspections', to: '/reports/inspections' },
  { text: id, to: `/reports/inspections/${id}` },
];
const gridTemplateColumns = 'repeat(5, 1fr)';

interface Column {
  key: keyof PeruInspectionReport;
  label: string;
}

export const columns: Column[] = [
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

const getValues = (data: PeruInspectionReport) => [
  {
    label: 'Quality Score',
    value: <ty.HugeText inverted>{data.qualityScore}</ty.HugeText>,
  },
  {
    label: 'Condition Score',
    value: <ty.HugeText inverted>{data.conditionScore}</ty.HugeText>,
  },
  {
    label: 'Avg Net Weight (kg)',
    value: <ty.HugeText inverted>{data.avgNetWeight}</ty.HugeText>,
  },
  {
    label: 'Avg Bunches / Box',
    value: <ty.HugeText inverted>{data.avgBunchesPerBox}</ty.HugeText>,
  },
  {
    label: '°Brix',
    value: (
      <l.Div width={th.sizes.fill}>
        {([
          { label: 'Max', key: 'brixMax' },
          { label: 'Avg', key: 'brixAvg' },
          { label: 'Min', key: 'brixMin' },
        ] as Column[]).map(({ label, key }, idx) => (
          <l.Flex
            alignCenter
            justifyBetween
            key={idx}
            mb={th.spacing.xs}
            mx={th.spacing.sm}
          >
            <ty.SmallText inverted secondary>
              {label}
            </ty.SmallText>
            <ty.LargeText fontFamily={th.fontFamilies.header} inverted my={0}>
              {data[key]}
            </ty.LargeText>
          </l.Flex>
        ))}
      </l.Div>
    ),
  },
];

const GridContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  padding: `${th.spacing.sm} ${th.spacing.md}`,
});

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { data } = useInspections(id);
  const reportData = data[0];
  const { Lightbox, openLightbox } = useLightbox(
    reportData ? reportData.imageUrls : [],
  );

  if (!reportData) {
    return null;
  }

  const values = getValues(reportData);

  return (
    <Page breadcrumbs={breadcrumbs(id)} title={`Inspection Report - ${id}`}>
      <l.Flex alignStart flex={1}>
        <l.Div flex={8}>
          <GridContainer gridTemplateColumns={gridTemplateColumns}>
            {columns.map(({ key, label }, idx) => (
              <l.Div height={th.sizes.fill} key={idx} py={th.spacing.sm}>
                <ty.SmallText mb={th.spacing.sm} secondary>
                  {label}
                </ty.SmallText>
                <ty.BodyText>{reportData[key]}</ty.BodyText>
              </l.Div>
            ))}
          </GridContainer>
          <l.Flex justifyBetween my={th.spacing.lg} width={th.sizes.fill}>
            {values.map((value, idx) => (
              <React.Fragment key={idx}>
                <ValuePanel {...value} />
                {idx < values.length - 1 && <l.Div width={th.spacing.md} />}
              </React.Fragment>
            ))}
          </l.Flex>
          <ty.SmallText mb={th.spacing.sm} secondary>
            QC Comments
          </ty.SmallText>
          <ty.BodyText>{reportData.comments}</ty.BodyText>
        </l.Div>
        <l.Div width={th.spacing.lg} />
        <l.Scroll flex={3} height={th.sizes.fill}>
          <ty.SmallText mb={th.spacing.sm} secondary>
            Images
          </ty.SmallText>
          <l.Flex column pr={th.spacing.tn}>
            {reportData.imageUrls.map((imageUrl, idx) => (
              <l.Div
                cursor="pointer"
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openLightbox(idx);
                }}
              >
                <l.Img
                  width={th.sizes.fill}
                  py={th.spacing.tn}
                  mr={th.spacing.tn}
                  src={`${API_BASE}${imageUrl}`}
                />
              </l.Div>
            ))}
          </l.Flex>
        </l.Scroll>
      </l.Flex>
      <Lightbox />
    </Page>
  );
};

export default Details;
