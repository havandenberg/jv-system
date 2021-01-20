import React from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';

import { API_BASE } from 'api';
import { useInspections } from 'api/inspections';
import Page from 'components/page';
import FeaturedValue from 'components/featured-value';
import useLightbox from 'hooks/use-lightbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import Chart from './chart';
import {
  baseLabels,
  getAvgConditionChartData,
  getAvgQualityChartLabels,
  getFeaturedValues,
} from './data-utils';
import Table from './table';

const breadcrumbs = (id: string) => [
  { text: 'All Inspections', to: '/reports/inspections' },
  { text: id, to: `/reports/inspections/${id}` },
];

const BaseDataContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  gridTemplateColumns: 'repeat(5, 1fr)',
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

  const featuredValues = getFeaturedValues(reportData);
  const avgQualityData = getAvgQualityChartLabels(reportData);
  const avgConditionData = getAvgConditionChartData(reportData);

  return (
    <Page breadcrumbs={breadcrumbs(id)} title={`Inspection Report - ${id}`}>
      <l.Flex alignStart flex={1}>
        <l.Div flex={8}>
          <BaseDataContainer>
            {baseLabels.map(({ key, label }, idx) => (
              <l.Div height={th.sizes.fill} key={idx} py={th.spacing.sm}>
                <ty.CaptionText mb={th.spacing.sm} secondary>
                  {label}
                </ty.CaptionText>
                <ty.BodyText>{reportData[key]}</ty.BodyText>
              </l.Div>
            ))}
          </BaseDataContainer>
          <l.Flex justifyBetween my={th.spacing.xl} width={th.sizes.fill}>
            {featuredValues.map((value, idx) => (
              <React.Fragment key={idx}>
                <FeaturedValue {...value} />
                {idx < featuredValues.length - 1 && (
                  <l.Div width={th.spacing.md} />
                )}
              </React.Fragment>
            ))}
          </l.Flex>
          <ty.CaptionText mb={th.spacing.sm} secondary>
            QC Comments
          </ty.CaptionText>
          <ty.BodyText mb={th.spacing.xl}>{reportData.comments}</ty.BodyText>
          <l.Flex justifyBetween mb={th.spacing.md} width={700}>
            <Chart data={avgQualityData} title="Average Quality (%)" />
            <l.Div width={th.spacing.md} />
            <Chart data={avgConditionData} title="Average Condition (%)" />
          </l.Flex>
          <Table pallets={reportData.pallets} />
          <l.Div height={th.spacing.lg} />
        </l.Div>
        <l.Div width={th.spacing.lg} />
        <l.Div flex={3}>
          <ty.CaptionText mb={th.spacing.md} secondary>
            Images
          </ty.CaptionText>
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
        </l.Div>
      </l.Flex>
      <Lightbox />
    </Page>
  );
};

export default Details;
