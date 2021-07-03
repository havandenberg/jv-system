import React from 'react';
import { pluck } from 'ramda';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useLightbox from 'hooks/use-lightbox';
import { PsaArrivalPicture, PsaGrapePallet } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { InspectionTypes } from '../..';
import {
  baseLabels,
  conditionLabels,
  generalLabels,
  getFeaturedValues,
  qualityLabels,
} from './data-utils';
import FeaturedValue from 'components/featured-value';

const breadcrumbs = (reportId: string, id: string, search: string) => [
  {
    text: 'All Inspections',
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}`,
  },
  {
    text: reportId,
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}/${reportId}/pallets${search}`,
  },
  {
    text: 'Pallet',
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}/${reportId}/pallets/${id}${search}`,
  },
];

const Details = () => {
  const { reportId, id } = useParams<{
    id: string;
    reportId: string;
  }>();
  const { search } = useLocation();
  const { data, error, loading } = api.usePsaArrivalPallet(id);
  const imageUrls = data
    ? pluck('imageUrl', data.pictures.nodes as PsaArrivalPicture[]) || []
    : [];
  const titleList = data
    ? (data.pictures.nodes as PsaArrivalPicture[]).map(
        (picture) => `${picture.pictureDescription}`,
      )
    : undefined;

  const { Lightbox, openLightbox } = useLightbox(
    imageUrls,
    '',
    `${api.baseURL}/`,
    titleList,
  );

  const featuredValues = data ? getFeaturedValues(data as PsaGrapePallet) : [];

  return (
    <Page
      breadcrumbs={breadcrumbs(reportId, id, search)}
      title="Pallet Inspection Details"
    >
      {data ? (
        <l.Flex alignStart flex={1} mb={th.spacing.xxxl}>
          <l.Div flex={8}>
            <BaseData<PsaGrapePallet> data={data} labels={baseLabels} />
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
            <ty.BodyText mb={data.comment2 ? th.spacing.sm : th.spacing.xl}>
              {data.comment1}
            </ty.BodyText>
            {data.comment2 && (
              <ty.BodyText mb={th.spacing.xl}>{data.comment2}</ty.BodyText>
            )}
            <l.Grid
              alignStart
              gridColumnGap={th.spacing.md}
              gridTemplateColumns="repeat(3, 1fr)"
              width={th.sizes.fill}
            >
              {['General Details', 'Quality Defects', 'Condition Defects'].map(
                (label) => (
                  <ty.BodyText key={label} mb={th.spacing.lg}>
                    {label}
                  </ty.BodyText>
                ),
              )}
              {[generalLabels, qualityLabels, conditionLabels].map(
                (labelSet) => (
                  <l.Grid
                    alignCenter
                    gridTemplateColumns="1fr 60px"
                    gridRowGap={th.spacing.sm}
                    width={th.sizes.fill}
                  >
                    {labelSet.map((detail, idx) => (
                      <React.Fragment key={idx}>
                        <ty.CaptionText secondary>
                          {detail.label}:
                        </ty.CaptionText>
                        <l.Flex justifyCenter>
                          <ty.BodyText>{data[detail.key] || '-'}</ty.BodyText>
                        </l.Flex>
                      </React.Fragment>
                    ))}
                  </l.Grid>
                ),
              )}
            </l.Grid>
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
          data={data ? (data as any[]) || [] : []}
          error={error}
          loading={loading}
        />
      )}
      <Lightbox />
    </Page>
  );
};

export default Details;
