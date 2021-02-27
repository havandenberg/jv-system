import React from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';

import api from 'api';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import FeaturedValue from 'components/featured-value';
import useLightbox from 'hooks/use-lightbox';
import { PeruDepartureInspectionPallet } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { InspectionType } from '..';
import Table from '../table';
import Chart from './chart';
import {
  baseLabels,
  getAvgConditionChartData,
  getAvgPallet,
  getAvgQualityChartLabels,
  getFeaturedValues,
  getTableData,
} from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'All Inspections',
    to: `/reports/inspections?reportType=${InspectionType.PERU_DEPARTURE}`,
  },
  { text: id, to: `/reports/inspections/d-peru/${id}` },
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
    `${api.baseURL}/`,
  );

  const featuredValues = reportData ? getFeaturedValues(reportData) : [];
  const avgQualityData = reportData ? getAvgQualityChartLabels(reportData) : [];
  const avgConditionData = reportData
    ? getAvgConditionChartData(reportData)
    : [];
  const pallets = reportData
    ? (reportData.peruDepartureInspectionPalletsByContainerId
        .nodes as PeruDepartureInspectionPallet[])
    : [];

  return (
    <Page
      actions={[
        <b.Primary key={0} mr={th.spacing.sm}>
          View Arrival
        </b.Primary>,
        <b.Primary key={1}>Compare</b.Primary>,
      ]}
      breadcrumbs={breadcrumbs(id)}
      title="Departure Inspection - Peru"
    >
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
            <Table<PeruDepartureInspectionPallet>
              avgPallet={getAvgPallet(pallets)}
              getTableData={getTableData}
              pallets={pallets.filter(
                (pallet) => pallet.palletId.toLowerCase() !== 'average',
              )}
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
        <DataMessage
          data={data ? (data.nodes as any[]) || [] : []}
          error={error}
          loading={loading}
        />
      )}
      <Lightbox />
    </Page>
  );
};

export default Details;
