import React from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';

import api from 'api';
import Page from 'components/page';
import FeaturedValue from 'components/featured-value';
import useLightbox from 'hooks/use-lightbox';
import { PeruDepartureInspection, PeruDepartureInspectionPallet } from 'types';
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
import { InspectionsDataMessage } from './index';
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
  paddingLeft: th.spacing.md,
  paddingRight: th.spacing.sm,
  paddingTop: th.spacing.sm,
});

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { data, error, loading } = api.usePeruDepartureInspection(id);
  const reportData = data && data.nodes[0];
  const { Lightbox, openLightbox } = useLightbox(
    reportData ? reportData.imageUrls || [] : [],
    reportData ? reportData.containerId : undefined,
  );

  const featuredValues = reportData ? getFeaturedValues(reportData) : [];
  const avgQualityData = reportData ? getAvgQualityChartLabels(reportData) : [];
  const avgConditionData = reportData
    ? getAvgConditionChartData(reportData)
    : [];

  return (
    <Page breadcrumbs={breadcrumbs(id)} title={`Inspection Report - ${id}`}>
      {reportData ? (
        <l.Flex alignStart flex={1}>
          <l.Div flex={8}>
            <BaseDataContainer>
              {baseLabels.map(({ key, label }, idx) => (
                <l.Div
                  height={th.sizes.fill}
                  key={idx}
                  pb={th.spacing.md}
                  pr={th.spacing.sm}
                  pt={th.spacing.sm}
                >
                  <ty.CaptionText mb={th.spacing.sm} secondary>
                    {label}
                  </ty.CaptionText>
                  <ty.BodyText>{reportData[key]}</ty.BodyText>
                </l.Div>
              ))}
            </BaseDataContainer>
            <l.Flex
              justifyBetween
              mb={th.spacing.xl}
              mt={th.spacing.lg}
              width={th.sizes.fill}
            >
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
              <Chart
                data={avgQualityData}
                title="Average Quality Defects (%)"
              />
              <l.Div width={th.spacing.md} />
              <Chart
                data={avgConditionData}
                title="Average Condition Defects (%)"
              />
            </l.Flex>
            <Table
              pallets={
                reportData.peruDepartureInspectionPalletsByContainerId
                  .nodes as PeruDepartureInspectionPallet[]
              }
            />
            <l.Div height={th.spacing.lg} />
          </l.Div>
          <l.Div width={th.spacing.lg} />
          <l.Div flex={3}>
            <ty.CaptionText mb={th.spacing.md} secondary>
              Images
            </ty.CaptionText>
            <l.Flex column pr={th.spacing.tn}>
              {(reportData.imageUrls || []).map(
                (imageUrl: string, idx: number) => (
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
                      src={`${api.baseURL}/${imageUrl}`}
                    />
                  </l.Div>
                ),
              )}
            </l.Flex>
          </l.Div>
        </l.Flex>
      ) : (
        <InspectionsDataMessage
          data={data ? (data.nodes as PeruDepartureInspection[]) || [] : []}
          error={error}
          loading={loading}
        />
      )}
      <Lightbox />
    </Page>
  );
};

export default Details;
