import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import FeaturedValues from 'components/featured-values';
import ImageList from 'components/reports/inspections/psa-arrival/image-list';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { useDateRangeQueryParams } from 'hooks/use-query-params';
import {
  PsaApplePallet,
  PsaCherryPallet,
  PsaCitrusPallet,
  PsaGrapePallet,
  PsaLemonPallet,
  PsaPearPallet,
  PsaPersimmonPallet,
  PsaPomegranatePallet,
  PsaStoneFruitPallet,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { InspectionTypes } from '../..';
import {
  baseLabels,
  grapeConditionLabels,
  grapeGeneralLabels,
  getGrapeFeaturedValues,
  grapeQualityLabels,
  citrusConditionLabels,
  citrusGeneralLabels,
  citrusQualityLabels,
  getCitrusFeaturedValues,
  stoneFruitConditionLabels,
  stoneFruitGeneralLabels,
  stoneFruitQualityLabels,
  getStoneFruitFeaturedValues,
  pomegranateGeneralLabels,
  pomegranateQualityLabels,
  pomegranateConditionLabels,
  getPomegranateFeaturedValues,
  persimmonGeneralLabels,
  persimmonQualityLabels,
  persimmonConditionLabels,
  getPersimmonFeaturedValues,
  pearGeneralLabels,
  pearQualityLabels,
  pearConditionLabels,
  getPearFeaturedValues,
  lemonGeneralLabels,
  lemonQualityLabels,
  lemonConditionLabels,
  getLemonFeaturedValues,
  cherryGeneralLabels,
  cherryQualityLabels,
  cherryConditionLabels,
  getCherryFeaturedValues,
  appleGeneralLabels,
  appleQualityLabels,
  appleConditionLabels,
  getAppleFeaturedValues,
} from './data-utils';

const breadcrumbs = (
  reportId: string,
  id: string,
  search: string,
  dateParams: string,
) => [
  {
    text: 'All Inspections',
    to: `/reports/inspections/${InspectionTypes.ARRIVAL}${dateParams}`,
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

const SecondaryDetails = <T extends {}>({
  data,
  generalLabels,
  qualityLabels,
  conditionLabels,
}: {
  data: T;
  generalLabels: LabelInfo<T>[];
  qualityLabels: LabelInfo<T>[];
  conditionLabels: LabelInfo<T>[];
}) => (
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
    {[generalLabels, qualityLabels, conditionLabels].map((labelSet, idx) => (
      <l.Grid
        alignCenter
        gridTemplateColumns="1fr 60px"
        gridRowGap={th.spacing.sm}
        key={idx}
        width={th.sizes.fill}
      >
        {labelSet.map((detail, idx) => (
          <React.Fragment key={idx}>
            <ty.CaptionText secondary>{detail.label}:</ty.CaptionText>
            <l.Flex justifyCenter>
              <ty.BodyText>{data[detail.key] || '-'}</ty.BodyText>
            </l.Flex>
          </React.Fragment>
        ))}
      </l.Grid>
    ))}
  </l.Grid>
);

const Details = () => {
  const { reportId, id } = useParams<{
    id: string;
    reportId: string;
  }>();
  const { search } = useLocation();
  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const dateParams =
    startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
  const { data, error, loading } = api.usePsaArrivalPallet(id);

  const getData = () => {
    if (data) {
      const {
        psaGrapePallet,
        psaCitrusPallet,
        psaStoneFruitPallet,
        psaPomegranatePallet,
        psaPersimmonPallet,
        psaPearPallet,
        psaLemonPallet,
        psaCherryPallet,
        psaApplePallet,
      } = data;

      if (psaGrapePallet) {
        return {
          baseData: (
            <BaseData<PsaGrapePallet>
              data={psaGrapePallet as PsaGrapePallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaGrapePallet}
              generalLabels={grapeGeneralLabels}
              qualityLabels={grapeQualityLabels}
              conditionLabels={grapeConditionLabels}
            />
          ),
          featuredValues: getGrapeFeaturedValues(
            psaGrapePallet as PsaGrapePallet,
          ),
          pallet: psaGrapePallet,
        };
      }

      if (psaCitrusPallet) {
        return {
          baseData: (
            <BaseData<PsaCitrusPallet>
              data={psaCitrusPallet as PsaCitrusPallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaCitrusPallet}
              generalLabels={citrusGeneralLabels}
              qualityLabels={citrusQualityLabels}
              conditionLabels={citrusConditionLabels}
            />
          ),
          featuredValues: getCitrusFeaturedValues(
            psaCitrusPallet as PsaCitrusPallet,
          ),
          pallet: psaCitrusPallet,
        };
      }

      if (psaStoneFruitPallet) {
        return {
          baseData: (
            <BaseData<PsaStoneFruitPallet>
              data={psaStoneFruitPallet as PsaStoneFruitPallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaStoneFruitPallet}
              generalLabels={stoneFruitGeneralLabels}
              qualityLabels={stoneFruitQualityLabels}
              conditionLabels={stoneFruitConditionLabels}
            />
          ),
          featuredValues: getStoneFruitFeaturedValues(
            psaStoneFruitPallet as PsaStoneFruitPallet,
          ),
          pallet: psaStoneFruitPallet,
        };
      }

      if (psaPomegranatePallet) {
        return {
          baseData: (
            <BaseData<PsaPomegranatePallet>
              data={psaPomegranatePallet as PsaPomegranatePallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaPomegranatePallet}
              generalLabels={pomegranateGeneralLabels}
              qualityLabels={pomegranateQualityLabels}
              conditionLabels={pomegranateConditionLabels}
            />
          ),
          featuredValues: getPomegranateFeaturedValues(
            psaPomegranatePallet as PsaPomegranatePallet,
          ),
          pallet: psaPomegranatePallet,
        };
      }

      if (psaPersimmonPallet) {
        return {
          baseData: (
            <BaseData<PsaPersimmonPallet>
              data={psaPersimmonPallet as PsaPersimmonPallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaPersimmonPallet}
              generalLabels={persimmonGeneralLabels}
              qualityLabels={persimmonQualityLabels}
              conditionLabels={persimmonConditionLabels}
            />
          ),
          featuredValues: getPersimmonFeaturedValues(
            psaPersimmonPallet as PsaPersimmonPallet,
          ),
          pallet: psaPersimmonPallet,
        };
      }

      if (psaPearPallet) {
        return {
          baseData: (
            <BaseData<PsaPearPallet>
              data={psaPearPallet as PsaPearPallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaPearPallet}
              generalLabels={pearGeneralLabels}
              qualityLabels={pearQualityLabels}
              conditionLabels={pearConditionLabels}
            />
          ),
          featuredValues: getPearFeaturedValues(psaPearPallet as PsaPearPallet),
          pallet: psaPearPallet,
        };
      }

      if (psaLemonPallet) {
        return {
          baseData: (
            <BaseData<PsaLemonPallet>
              data={psaLemonPallet as PsaLemonPallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaLemonPallet}
              generalLabels={lemonGeneralLabels}
              qualityLabels={lemonQualityLabels}
              conditionLabels={lemonConditionLabels}
            />
          ),
          featuredValues: getLemonFeaturedValues(
            psaLemonPallet as PsaLemonPallet,
          ),
          pallet: psaLemonPallet,
        };
      }

      if (psaCherryPallet) {
        return {
          baseData: (
            <BaseData<PsaCherryPallet>
              data={psaCherryPallet as PsaCherryPallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaCherryPallet}
              generalLabels={cherryGeneralLabels}
              qualityLabels={cherryQualityLabels}
              conditionLabels={cherryConditionLabels}
            />
          ),
          featuredValues: getCherryFeaturedValues(
            psaCherryPallet as PsaCherryPallet,
          ),
          pallet: psaCherryPallet,
        };
      }

      if (psaApplePallet) {
        return {
          baseData: (
            <BaseData<PsaApplePallet>
              data={psaApplePallet as PsaApplePallet}
              labels={baseLabels}
            />
          ),
          secondaryDetails: (
            <SecondaryDetails
              data={psaApplePallet}
              generalLabels={appleGeneralLabels}
              qualityLabels={appleQualityLabels}
              conditionLabels={appleConditionLabels}
            />
          ),
          featuredValues: getAppleFeaturedValues(
            psaApplePallet as PsaApplePallet,
          ),
          pallet: psaApplePallet,
        };
      }
    }

    return {
      baseData: null,
      generalLabels: [],
      qualityLabels: [],
      conditionLabels: [],
      featuredValues: [],
      pallet: undefined,
    };
  };

  const { baseData, featuredValues, secondaryDetails, pallet } = getData();

  return (
    <Page
      breadcrumbs={breadcrumbs(reportId, id, search, dateParams)}
      title="Pallet Inspection Details"
    >
      {pallet ? (
        <l.Flex alignStart flex={1} mb={th.spacing.xxxl}>
          <l.Div flex={8}>
            {baseData}
            <FeaturedValues values={featuredValues} />
            <ty.CaptionText mb={th.spacing.sm} secondary>
              QC Comments
            </ty.CaptionText>
            <ty.BodyText mb={pallet.comment2 ? th.spacing.sm : th.spacing.xl}>
              {pallet.comment1}
            </ty.BodyText>
            {pallet.comment2 && (
              <ty.BodyText mb={th.spacing.xl}>{pallet.comment2}</ty.BodyText>
            )}
            {secondaryDetails}
          </l.Div>
          <l.Div width={th.spacing.lg} />
          <l.Div flex={3}>
            <ImageList data={pallet} />
          </l.Div>
        </l.Flex>
      ) : (
        <DataMessage
          data={pallet ? (pallet as any[]) || [] : []}
          error={error}
          loading={loading}
        />
      )}
    </Page>
  );
};

export default Details;
