import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import FeaturedValue from 'components/featured-value';
import useLightbox from 'hooks/use-lightbox';
import {
  ChileDepartureInspection,
  ChileDepartureInspectionPallet,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { InspectionTypes } from '..';
import Table from '../table';
import Chart from './chart';
import {
  baseLabels,
  defectsKeys,
  getAvgPallet,
  getChartData,
  getFeaturedValues,
  getTableData,
} from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'All Inspections',
    to: `/reports/inspections/${InspectionTypes.CHILE_DEPARTURE}`,
  },
  {
    text: id,
    to: `/reports/inspections/${InspectionTypes.CHILE_DEPARTURE}/${id}`,
  },
];

const Details = () => {
  const { id } =
    useParams<{
      id: string;
    }>();
  const { data, error, loading } = api.useChileDepartureInspection(id);
  const pallets = (
    data ? data.pallets : []
  ) as ChileDepartureInspectionPallet[];
  const reportData = pallets[0];
  const imageUrls = data ? data.imageUrls || [] : [];
  const { Lightbox, openLightbox } = useLightbox(
    imageUrls,
    reportData ? `${reportData.lotId}` : undefined,
    `${api.baseURL}/`,
  );

  const featuredValues = reportData
    ? getFeaturedValues(data as ChileDepartureInspection)
    : [];
  const chartData = reportData
    ? getChartData(pallets as ChileDepartureInspectionPallet[])
    : [];
  const avgPallet = getAvgPallet(pallets) as ChileDepartureInspectionPallet;
  const avgPalletDefects = avgPallet
    ? Object.keys(defectsKeys)
        .filter(
          (key) => avgPallet[key as keyof ChileDepartureInspectionPallet] > 0,
        )
        .map((key) => ({
          label: defectsKeys[key],
          value: avgPallet[key as keyof ChileDepartureInspectionPallet],
        }))
    : [];

  return (
    <Page
      actions={[
        <b.Primary disabled key={0} mr={th.spacing.sm}>
          View Arrival
        </b.Primary>,
        <b.Primary disabled key={1}>
          Compare
        </b.Primary>,
      ]}
      breadcrumbs={breadcrumbs(id)}
      title="Departure Inspection - Chile"
    >
      {reportData ? (
        <l.Flex alignStart flex={1}>
          <l.Div flex={8}>
            <BaseData<ChileDepartureInspectionPallet>
              data={reportData}
              labels={baseLabels}
            />
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
            <l.Flex justifyBetween mb={th.spacing.lg} width={700}>
              <Chart data={chartData} title="Pallets By Condition" />
              <l.Div width={th.spacing.md} />
              {avgPalletDefects.length > 0 ? (
                <l.Div>
                  <ty.CaptionText mb={th.spacing.lg} secondary>
                    Main Defects (%)
                  </ty.CaptionText>
                  <l.Div>
                    {avgPalletDefects.map(({ label, value }) => (
                      <ty.BodyText key={label} mb={th.spacing.sm}>
                        {label}: {value}
                      </ty.BodyText>
                    ))}
                  </l.Div>
                </l.Div>
              ) : null}
            </l.Flex>
            <Table<ChileDepartureInspectionPallet>
              avgPallet={avgPallet}
              getTableData={getTableData}
              pallets={pallets}
            />
            <l.Div height={th.spacing.lg} />
          </l.Div>
          <l.Div width={th.spacing.lg} />
          <l.Div flex={3}>
            <ty.CaptionText mb={th.spacing.md} secondary>
              Images ({imageUrls.length})
            </ty.CaptionText>
            <l.Flex column pr={th.spacing.tn}>
              {imageUrls.map((imageUrl: string, idx: number) => (
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
              ))}
            </l.Flex>
          </l.Div>
        </l.Flex>
      ) : (
        <DataMessage
          data={data?.pallets || []}
          error={error}
          loading={loading}
        />
      )}
      <Lightbox />
    </Page>
  );
};

export default Details;
